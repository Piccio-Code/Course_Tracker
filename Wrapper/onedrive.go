package wrapper

import (
	"context"
	"encoding/base64"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	. "github.com/Piccio-Code/Course_Tracker/app/models"
	"github.com/joho/godotenv"
	. "github.com/microsoftgraph/msgraph-sdk-go"
	_ "github.com/microsoftgraph/msgraph-sdk-go"
	"github.com/microsoftgraph/msgraph-sdk-go/models"
	graphshares "github.com/microsoftgraph/msgraph-sdk-go/shares"
	"os"
	"path/filepath"
	"strings"
)

type Onedrive struct {
	graphClient *GraphServiceClient
}

func NewOnedrive() (o *Onedrive, err error) {
	err = godotenv.Load("app/.env")

	if err != nil {
		return nil, err
	}

	cred, err := azidentity.NewDeviceCodeCredential(&azidentity.DeviceCodeCredentialOptions{
		TenantID: os.Getenv("TENTANT_ID"),
		ClientID: os.Getenv("CLIENT_ID"),
		UserPrompt: func(ctx context.Context, message azidentity.DeviceCodeMessage) error {
			fmt.Println(message.Message)
			return nil
		},
	})

	if err != nil {
		return nil, err
	}

	graphClient, err := NewGraphServiceClientWithCredentials(cred, []string{
		"Files.Read.All",
		"Files.ReadWrite.All",
		"Files.ReadWrite.AppFolder",
		"ServiceActivity-OneDrive.Read.All",
		"Sites.Read.All",
		"Sites.ReadWrite.All",
	})

	if err != nil {
		return nil, err
	}

	if _, err = graphClient.Me().Get(context.Background(), nil); err != nil {
		return nil, err
	}

	return &Onedrive{graphClient: graphClient}, nil
}

func (o *Onedrive) NewCourse(sharedFolderUrl string) (*Course, error) {

	driveItem, err := o.GetDriveItems(sharedFolderUrl)

	if err != nil {
		return nil, err
	}

	courseParts, totalDuarion, err := o.GetCourseParts(driveItem.GetChildren())

	if err != nil {
		return nil, err
	}

	name, err := o.GetCourseName(sharedFolderUrl)

	if err != nil {
		return nil, err
	}

	course := &Course{Name: name, Parts: courseParts, Duration: totalDuarion}

	return course, nil
}

func (o *Onedrive) GetCourseName(sharedFolderUrl string) (courseFolderName string, err error) {
	driveItem, err := o.GetDriveItems(sharedFolderUrl)

	if err != nil {
		return "", err
	}

	return *driveItem.GetName(), nil
}

func (o *Onedrive) GetDriveItems(sharedFolderUrl string) (driveItem models.DriveItemable, err error) {
	requestParameters := &graphshares.ItemDriveItemRequestBuilderGetQueryParameters{
		Expand: []string{"children"},
	}
	configuration := &graphshares.ItemDriveItemRequestBuilderGetRequestConfiguration{
		QueryParameters: requestParameters,
	}

	driveItem, err = o.graphClient.Shares().BySharedDriveItemId(getGraphEncodedURL(sharedFolderUrl)).DriveItem().Get(context.Background(), configuration)

	if err != nil {
		return nil, err
	}

	return driveItem, nil
}

func (o *Onedrive) GetFilesFromFolder(folder models.DriveItemable) (courseFiles []CourseFile, totalDuration int, err error) {
	filesItem, err := o.GetDriveItems(*folder.GetWebUrl())

	if err != nil {
		return nil, 0, err
	}

	files := filesItem.GetChildren()

	for _, file := range files {
		fileName := *file.GetName()
		url := *file.GetWebUrl()
		format := getFileFormat(fileName)
		duration := 0

		if format == "vtt" {
			continue
		}

		isVideo := file.GetVideo() != nil

		if isVideo {
			duration = int(*file.GetVideo().GetDuration())
			totalDuration += duration
		}

		courseFiles = append(courseFiles, CourseFile{Name: fileName, URL: url, Format: format, Duration: duration})
	}

	return courseFiles, totalDuration, nil
}

func (o *Onedrive) GetCourseParts(folders []models.DriveItemable) (courseParts []CoursePart, totalDuration int, err error) {

	for _, folder := range folders {
		PartName := *folder.GetName()

		files, partDuration, err := o.GetFilesFromFolder(folder)

		if err != nil {
			return nil, 0, err
		}

		totalDuration += partDuration

		courseParts = append(courseParts, CoursePart{Name: PartName, Files: files, Duration: partDuration})
	}

	return courseParts, totalDuration, nil
}

func (o *Onedrive) GetFolders(sharedFolderUrl string) (courseFolders []CourseFolder, err error) {
	folderItem, err := o.GetDriveItems(sharedFolderUrl)

	if err != nil {
		return nil, err
	}

	folders := folderItem.GetChildren()

	for _, folder := range folders {
		isValidFolder := folder.GetFolder() != nil

		if isValidFolder {
			courseFolders = append(courseFolders, CourseFolder{Name: *folder.GetName(), URL: *folder.GetWebUrl()})
		}
	}

	if len(courseFolders) == 0 {
		return nil, fmt.Errorf("the provided url has no folder\nURL: %s ", sharedFolderUrl)
	}

	return courseFolders, nil
}

func getGraphEncodedURL(sharingURL string) string {
	base64Value := base64.URLEncoding.EncodeToString([]byte(sharingURL))

	trimmedBase64 := strings.TrimRight(base64Value, "=")

	return "u!" + trimmedBase64
}

func getFileFormat(filename string) string {
	ext := filepath.Ext(filename)

	return strings.TrimPrefix(ext, ".")
}

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

	courseParts, courseFiles, totalDuration, err := o.GetCourseParts(driveItem.GetChildren())

	if err != nil {
		return nil, err
	}

	name := *driveItem.GetName()

	course := &Course{Name: name, Parts: courseParts, Files: courseFiles, Duration: totalDuration}

	return course, nil
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

func (o *Onedrive) GetCourseParts(items []models.DriveItemable) (courseParts []CoursePart, courseFiles []CourseFile, totalDuration int, err error) {

	for _, item := range items {

		isFile := item.GetFile() != nil

		if isFile {
			courseFile := GetCourseFile(item)
			courseFiles = append(courseFiles, courseFile)
			continue
		}

		PartName := *item.GetName()

		subParts, partFile, partDuration, err := o.GetPart(item)

		if err != nil {
			return nil, nil, 0, err
		}

		totalDuration += partDuration

		courseParts = append(courseParts, CoursePart{Name: PartName, Files: partFile, SubParts: subParts, Duration: partDuration})
	}

	if courseParts == nil {
		return nil, nil, 0, fmt.Errorf("no folder found in the directory")
	}

	return courseParts, courseFiles, totalDuration, nil
}

func (o *Onedrive) GetPart(folder models.DriveItemable) (subParts []CoursePart, partFiles []CourseFile, totalDuration int, err error) {
	folderContentItem, err := o.GetDriveItems(*folder.GetWebUrl())

	if err != nil {
		return nil, nil, 0, err
	}

	folderContent := folderContentItem.GetChildren()

	for _, item := range folderContent {

		isFile := item.GetFile() != nil

		isFolder := item.GetFolder() != nil

		if isFolder {
			subPart, subFiles, subFilesDuration, err := o.GetPart(item)

			if err != nil {
				return nil, nil, 0, err
			}

			subParts = append(subParts, CoursePart{Name: *item.GetName(), SubParts: subPart, Files: subFiles})
			totalDuration += subFilesDuration
		}

		if isFile {
			courseFile := GetCourseFile(item)
			partFiles = append(partFiles, courseFile)
			totalDuration += courseFile.Duration
		}
	}

	if partFiles == nil {
		return nil, nil, 0, fmt.Errorf("the are no file in the directory")
	}

	return subParts, partFiles, totalDuration, nil
}

func GetCourseFile(file models.DriveItemable) CourseFile {
	fileName := *file.GetName()
	url := *file.GetWebUrl()
	format := getFileFormat(fileName)
	duration := 0

	isVideo := file.GetVideo() != nil

	if isVideo {
		duration = int(*file.GetVideo().GetDuration())
	}

	return CourseFile{Name: fileName, URL: url, Format: format, Duration: duration}
}

func getFileFormat(filename string) string {
	ext := filepath.Ext(filename)

	return strings.TrimPrefix(ext, ".")
}

func getGraphEncodedURL(sharingURL string) string {
	base64Value := base64.URLEncoding.EncodeToString([]byte(sharingURL))

	trimmedBase64 := strings.TrimRight(base64Value, "=")

	return "u!" + trimmedBase64
}

package wrapper

import "fmt"

type Course struct {
	Name  string
	Files map[string][]CourseFile
}

func (c *Course) GetPartsName() []string {
	keys := make([]string, 0, len(c.Files))

	for k, _ := range c.Files {
		keys = append(keys, k)
	}

	return keys
}

func (c *Course) GetPartDuration(part string) (int, error) {
	total := 0

	files, ok := c.Files[part]

	if !ok {
		return 0, fmt.Errorf("the part %s is not the course %s", part, c.Name)
	}

	for _, file := range files {
		total += file.Duration
	}

	return total, nil
}

func (c *Course) GetTotalDuration() (int, error) {
	total := 0

	for _, files := range c.Files {
		for _, file := range files {
			total += file.Duration
		}
	}

	return total, nil
}

package commentcontroller

import (
	"fmt"
	dbconnect "my-blog/server/controllers/db"
	model "my-blog/server/models"
	"net/http"
	"time"

	"github.com/labstack/echo"

	// PostgreSQL driver
	_ "github.com/lib/pq"
)

// GetAllComments from DB
func GetAllComments(c echo.Context) error {
	id := c.Param("postId")
	sqlStatement := "SELECT id, author, text, likes, postId, created_at, updated_at FROM comments WHERE postId=$1 ORDER BY id"
	rows, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Comments{}

	for rows.Next() {
		comment := model.Comment{}
		err2 := rows.Scan(&comment.ID, &comment.Author, &comment.Text, &comment.Likes, &comment.PostID, &comment.CreatedAt, &comment.UpdatedAt)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Comments = append(result.Comments, comment)
	}
	return c.JSON(http.StatusCreated, result)
}

// SaveComment to DB
func SaveComment(c echo.Context) error {
	postID := c.Param("postId")
	comment := new(model.Comment)
	if err := c.Bind(comment); err != nil {
		return err
	}
	sqlStatement := `
	INSERT INTO comments (author, text, likes, postId, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := dbconnect.Db.Query(sqlStatement, comment.Author, comment.Text, comment.Likes, postID, time.Now().Format("2 Jan 2006 15:04"), "")
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusCreated, comment)
}

// GetComment by id
func GetComment(c echo.Context) error {
	id := c.Param("commentId")
	sqlStatement := "SELECT id, author, text, likes, postId, created_at, updated_at FROM comments WHERE id=$1"
	rows, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Comments{}

	for rows.Next() {
		comment := model.Comment{}
		err2 := rows.Scan(&comment.ID, &comment.Author, &comment.Text, &comment.Likes, &comment.PostID, &comment.CreatedAt, &comment.UpdatedAt)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Comments = append(result.Comments, comment)
	}
	return c.JSON(http.StatusCreated, result.Comments[0])
}

// UpdateComment by id
func UpdateComment(c echo.Context) error {
	id := c.Param("commentId")
	comment := new(model.Comment)
	if err := c.Bind(comment); err != nil {
		return err
	}
	sqlStatement := "UPDATE comments SET text=$1, updated_at=$2 WHERE id=$3"
	_, err := dbconnect.Db.Query(sqlStatement, comment.Text, time.Now().Format("2 Jan 2006 15:04"), id)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusCreated, comment)
}

// DeleteComment by id
func DeleteComment(c echo.Context) error {
	id := c.Param("commentId")
	sqlStatement := "DELETE FROM comments WHERE id=$1"
	_, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusOK, "Comment number " + id + " deleted")
}

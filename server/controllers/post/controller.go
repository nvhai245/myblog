package postcontroller

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

// GetAllUserPosts from DB
func GetAllUserPosts(c echo.Context) error {
	user := c.Param("username")
	sqlStatement := "SELECT id, author, text, likes, comments, created_at, updated_at, title FROM posts WHERE author=$1 ORDER BY id"
	rows, err := dbconnect.Db.Query(sqlStatement, user)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Posts{}

	for rows.Next() {
		post := model.Post{}
		err2 := rows.Scan(&post.ID, &post.Author, &post.Text, &post.Likes, &post.Comments, &post.CreatedAt, &post.UpdatedAt, &post.Title)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Posts = append(result.Posts, post)
	}
	return c.JSON(http.StatusCreated, result)
}

// GetAllPosts from DB
func GetAllPosts(c echo.Context) error {
	sqlStatement := "SELECT id, author, text, likes, comments, created_at, updated_at, title FROM posts ORDER BY id"
	rows, err := dbconnect.Db.Query(sqlStatement)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Posts{}

	for rows.Next() {
		post := model.Post{}
		err2 := rows.Scan(&post.ID, &post.Author, &post.Text, &post.Likes, &post.Comments, &post.CreatedAt, &post.UpdatedAt, &post.Title)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Posts = append(result.Posts, post)
	}
	return c.JSON(http.StatusCreated, result)
}

// SavePost to DB
func SavePost(c echo.Context) error {
	post := new(model.Post)
	if err := c.Bind(post); err != nil {
		return err
	}
	sqlStatement := `
	INSERT INTO posts (author, text, likes, comments, created_at, updated_at, title)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := dbconnect.Db.Query(sqlStatement, post.Author, post.Text, post.Likes, post.Comments, time.Now().Format("2 Jan 2006 15:04"), "", post.Title)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusCreated, post)
}

// GetPost by id
func GetPost(c echo.Context) error {
	id := c.Param("postId")
	sqlStatement := "SELECT id, author, text, likes, comments, created_at, updated_at, title FROM posts WHERE id=$1"
	rows, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Posts{}

	for rows.Next() {
		post := model.Post{}
		err2 := rows.Scan(&post.ID, &post.Author, &post.Text, &post.Likes, &post.Comments, &post.CreatedAt, &post.UpdatedAt, &post.Title)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Posts = append(result.Posts, post)
	}
	return c.JSON(http.StatusCreated, result.Posts[0])
}

// UpdatePost by id
func UpdatePost(c echo.Context) error {
	id := c.Param("postId")
	post := new(model.Post)
	if err := c.Bind(post); err != nil {
		return err
	}
	sqlStatement := "UPDATE posts SET text=$1, updated_at=$2, title=$3 WHERE id=$4"
	_, err := dbconnect.Db.Query(sqlStatement, post.Text, time.Now().Format("2 Jan 2006 15:04"), post.Title, id)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusCreated, post)
}

// DeletePost by id
func DeletePost(c echo.Context) error {
	id := c.Param("postId")
	sqlStatement := "DELETE FROM posts WHERE id=$1"
	_, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusOK, "Post number " + id + " deleted")
}

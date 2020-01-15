package main

import (
	commentcontroller "my-blog/server/controllers/comment"
	_ "my-blog/server/controllers/db"
	postcontroller "my-blog/server/controllers/post"
	usercontroller "my-blog/server/controllers/user"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// Db configuration
// var Db = db.Db

func main() {
	app := echo.New()
	app.Use(middleware.Logger())
	app.Use(middleware.Recover())
	app.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  "client/build",
		HTML5: true,
	}))
	app.Static("/", "client/build")

	// User Routes
	app.GET("/api/users", usercontroller.GetAllUsers)
	app.POST("/api/users", usercontroller.SaveUser)
	app.GET("/api/users/:id", usercontroller.GetUser)
	app.PUT("/api/users/:id", usercontroller.UpdateUser)
	app.DELETE("api/users/:id", usercontroller.DeleteUser)

	// Post Routes
	app.GET("/api/users/:username/posts", postcontroller.GetAllUserPosts)
	app.GET("/api/posts", postcontroller.GetAllPosts)
	app.POST("/api/posts", postcontroller.SavePost)
	app.GET("/api/posts/:postId", postcontroller.GetPost)
	app.PUT("/api/posts/:postId", postcontroller.UpdatePost)
	app.DELETE("api/posts/:postId", postcontroller.DeletePost)

	// Comment Routes
	app.GET("/api/posts/:postId/comments", commentcontroller.GetAllComments)
	app.POST("/api/posts/:postId/comments", commentcontroller.SaveComment)
	app.GET("/api/posts/:postId/comments/:commentId", commentcontroller.GetComment)
	app.PUT("/api/posts/:postId/comments/:commentId", commentcontroller.UpdateComment)
	app.DELETE("api/posts/:postId/comments/:commentId", commentcontroller.DeleteComment)

	// Auth Routes
	app.POST("/api/login", usercontroller.Login)
	app.GET("/accessible", usercontroller.Accessible)
	r := app.Group("/restricted")
	config := middleware.JWTConfig{
		Claims:      &usercontroller.JwtCustomClaims{},
		SigningKey:  []byte("hari-blog"),
		TokenLookup: "cookie:jwt",
	}
	r.Use(middleware.JWTWithConfig(config))
	r.GET("", usercontroller.Restricted)

	app.Logger.Fatal(app.Start(":8000"))
}

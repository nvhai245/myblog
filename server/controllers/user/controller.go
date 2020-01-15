package usercontroller

import (
	"fmt"
	"log"
	dbconnect "my-blog/server/controllers/db"
	model "my-blog/server/models"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"

	// PostgreSQL driver
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// GetAllUsers from DB
func GetAllUsers(c echo.Context) error {
	sqlStatement := "SELECT id, username, email, avatar FROM users ORDER BY id"
	rows, err := dbconnect.Db.Query(sqlStatement)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Users{}

	for rows.Next() {
		user := model.User{}
		err2 := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Avatar)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Users = append(result.Users, user)
	}
	return c.JSON(http.StatusCreated, result)
}

// SaveUser to DB
func SaveUser(c echo.Context) error {
	user := new(model.User)
	if err := c.Bind(user); err != nil {
		return err
	}
	hash, error := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if error != nil {
		fmt.Println(error)
	}
	sqlStatement := `
	INSERT INTO users (username, email, avatar, hash)
	VALUES ($1, $2, $3, $4)`
	_, err := dbconnect.Db.Query(sqlStatement, user.Username, user.Email, user.Avatar, string(hash))
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusCreated, user)
}

// GetUser by id
func GetUser(c echo.Context) error {
	id := c.Param("id")
	sqlStatement := "SELECT id, username, email, avatar FROM users WHERE id=$1"
	rows, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
		//return c.JSON(http.StatusCreated, u);
	}
	defer rows.Close()
	result := model.Users{}

	for rows.Next() {
		user := model.User{}
		err2 := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Avatar)
		// Exit if we get an error
		if err2 != nil {
			return err2
		}
		result.Users = append(result.Users, user)
	}
	return c.JSON(http.StatusCreated, result.Users[0])
}

// UpdateUser by id
func UpdateUser(c echo.Context) error {
	id := c.Param("id")
	user := new(model.User)
	if err := c.Bind(user); err != nil {
		return err
	}
	sqlStatement := "UPDATE users SET username=$1, email=$2, avatar=$3 WHERE id=$4"
	_, err := dbconnect.Db.Query(sqlStatement, user.Username, user.Email, user.Avatar, id)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusCreated, user)
}

// DeleteUser by id
func DeleteUser(c echo.Context) error {
	id := c.Param("id")
	sqlStatement := "DELETE FROM users WHERE id=$1"
	_, err := dbconnect.Db.Query(sqlStatement, id)
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(http.StatusOK, id + " Deleted")
}

// AUTHENTICATION

// JwtCustomClaims to be exported
type JwtCustomClaims struct {
	Username string `json:"username"`
	Admin    bool   `json:"admin"`
	Avatar   string `json:"avatar"`
	Email    string `json:"email"`
	jwt.StandardClaims
}

// Login user
func Login(c echo.Context) error {
	user := new(model.LoginData)
	if err := c.Bind(&user); err != nil {
		return err
	}
	sqlStatement := "SELECT username, avatar, hash FROM users WHERE email=$1"
	rows, err := dbconnect.Db.Query(sqlStatement, user.Email)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	var (
		hash     []byte
		username string
		avatar   string
		isAdmin bool
	)
	for rows.Next() {
		if err := rows.Scan(&username, &avatar, &hash); err != nil {
			log.Fatal(err)
		}
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	error := bcrypt.CompareHashAndPassword(hash, []byte(user.Password))
	if error != nil {
		log.Println(error)
		return echo.ErrUnauthorized
	}

	// Set claims
	claims := &JwtCustomClaims{
		username,
		false,
		avatar,
		user.Email,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
		},
	}
	isAdmin = false
	if user.Email == "nvhai245@gmail.com" {
		claims.Admin = true
		isAdmin = true
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("hari-blog"))
	if err != nil {
		return err
	}

	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = t
	// cookie.Secure = true
	cookie.HttpOnly = true
	cookie.Path = "/"
	cookie.Expires = time.Now().Add(24 * time.Hour)
	c.SetCookie(cookie)
	loggedIn := model.AuthorizedUser{
		IsAdmin: isAdmin,
		Username: username,
		Avatar: avatar,
	}
	return c.JSON(http.StatusOK, loggedIn)
}

// Accessible Middleware
func Accessible(c echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

// Restricted Middleware
func Restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JwtCustomClaims)
	username := claims.Username
	admin := claims.Admin
	if admin == true {
		return c.String(http.StatusOK, "Welcome Admin "+username+"!")
	}
	return c.String(http.StatusOK, "Welcome "+username+"!")
}

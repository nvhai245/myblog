package model

// User model
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar"`
	Password     string `json:"password"`
}

// Users request for all users information
type Users struct {
	Users []User `json:"users"`
}

// Post model
type Post struct {
	Title string `json:"title"`
	ID string `json:"id"`
	Author string `json:"author"`
	Text string `json:"text"`
	Likes int `json:"likes"`
	Comments int `json:"comments"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// Posts array of an user
type Posts struct {
	Posts []Post `json:"posts"`
}

// Comment model
type Comment struct {
	ID string `json:"id"`
	Author string `json:"author"`
	Text string `json:"text"`
	Likes int `json:"likes"`
	PostID string `json:"postId"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// Comments array of a post
type Comments struct {
	Comments []Comment `json:"comments"`
}

// LoginData struct
type LoginData struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

// AuthorizedUser struct
type AuthorizedUser struct {
	IsAdmin bool `json:"isAdmin"`
	Username string `json:"username"`
	Avatar string `json:"avatar"`
}
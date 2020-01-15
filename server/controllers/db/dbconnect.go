package dbconnect

import (
	"database/sql"
	"fmt"
	// PostgreSQL driver
	_ "github.com/lib/pq"
)
// Db variable to use in controllers
var Db *sql.DB

func init() {
	Db = ConnectDb()
}
// ConnectDb PostgreSQL
func ConnectDb() *sql.DB {
	connStr := "postgres://rgpxlhlb:SFRfoyzlg2wBYlqXfUUVXIzjY1xhr-gi@satao.db.elephantsql.com:5432/rgpxlhlb"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	// defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("DB connected!")
	return db
}
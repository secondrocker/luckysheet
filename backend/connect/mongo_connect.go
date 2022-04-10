package connect

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	Mongo *mongo.Client
}

var DB *Database

//initialization
func init() {
	DB = &Database{
		Mongo: SetConnect(),
	}
}

//Connection settings
func SetConnect() *mongo.Client {
	uri := "mongodb://localhost:27017"
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri).SetMaxPoolSize(20)) //connection pool
	if err != nil {
		fmt.Println(err)
	}
	return client
}

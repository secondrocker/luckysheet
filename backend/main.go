package main

import (
	"backend/connect"
	"context"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Template struct {
	Id       string `json:"key" bson:"_id"`
	Title    string `json:"title" bson:"Title" form:"title"`
	Employee string `json:"employee" bson:"Employee"`
	Content  string `json:"content" bson:"Content" form:"content"`
}

func defaultConnection() *mongo.Collection {
	return connect.DB.Mongo.Database("bigdata").Collection("excel")
}

func main() {

	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/templates/show/:id", func(c *gin.Context) {
		id := c.Param("id")
		template := &Template{}
		if id == "0" {
			c.JSON(http.StatusOK, gin.H{"template": template})
			return
		}
		oid, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			log.Fatal(err)
		}

		defaultConnection().FindOne(context.TODO(), bson.M{"_id": oid}).Decode(template)
		c.JSON(http.StatusOK, gin.H{"template": template})
	})

	router.POST("/templates/save", func(c *gin.Context) {
		template := &Template{}
		c.ShouldBind(template)
		id := c.Request.FormValue("id")
		var resultId string
		if id == "" || id == "0" {
			result, err := defaultConnection().InsertOne(context.Background(), bson.M{"Content": template.Content, "Title": template.Title})
			if err != nil {
				log.Fatal(err)
			}
			resultId = result.InsertedID.(primitive.ObjectID).Hex()
		} else {
			oid, _ := primitive.ObjectIDFromHex(id)
			data := bson.M{"$set": bson.M{"Content": template.Content, "Title": template.Title}}
			_, err := defaultConnection().UpdateByID(context.Background(), oid, data)
			if err != nil {
				log.Fatal(err)
			}
			resultId = id
		}
		c.JSON(http.StatusOK, gin.H{"id": resultId})
	})

	router.POST("/templates/save_content", func(c *gin.Context) {
		id := c.Request.FormValue("id")
		content := c.Request.FormValue("id")
		defaultConnection().UpdateByID(context.Background(), id, Template{Content: content})
		c.JSON(http.StatusOK, gin.H{"id": id})

	})

	router.GET("templates", func(c *gin.Context) {
		records := []Template{}
		opts := options.Find().SetProjection(bson.D{{"_id", 1}, {"Title", 2}, {"Employee", 3}})

		cur, err := defaultConnection().Find(context.Background(), bson.M{}, opts)
		if err != nil {
			log.Fatal(err)
		}
		err = cur.All(context.Background(), &records)
		if err != nil {
			log.Fatal(err)
		}
		defer cur.Close(context.Background())
		c.JSON(http.StatusOK, gin.H{"records": records})
	})

	router.DELETE("templates/:id", func(c *gin.Context) {
		id := c.Param("id")
		oid, _ := primitive.ObjectIDFromHex(id)
		_, err := defaultConnection().DeleteOne(context.Background(), bson.M{"_id": oid})
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusOK, gin.H{"success": err == nil})
	})

	router.POST("demo", func(c *gin.Context) {
		records := []gin.H{
			gin.H{
				"sheet_name": "111",
				"offset":     1,
				"records": [][]interface{}{
					[]interface{}{1, 2, 3, 4},
					[]interface{}{2, 2, 3, 4},
				},
			},
			gin.H{
				"sheet_name": "222",
				"offset":     2,
				"records": [][]interface{}{
					[]interface{}{3, 2, 3, 4},
					[]interface{}{4, 2, 3, 4},
				},
			},
		}
		c.JSON(http.StatusOK, gin.H{
			"title":   "小测试",
			"records": records,
		})
	})

	http.ListenAndServe("localhost:4000", router)

}

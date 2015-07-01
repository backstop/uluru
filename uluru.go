package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

func main() {

	http.HandleFunc("/uluru/", func(w http.ResponseWriter, req *http.Request) {

		data, _ := ioutil.ReadAll(req.Body)

		ln := len(data)
		method := req.Method

		dataStr := string(data)
		log.Printf("Got request. %d bytes. Method %s. Data: \n%s\n", ln, method, dataStr)

		w.Write([]byte(""))
	})

	err := http.ListenAndServe(":9999", nil)
	if err != nil {
		log.Println(err.Error())
	}

}

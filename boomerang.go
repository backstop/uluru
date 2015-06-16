package main

import (
	"log"
	"net/http"
	"net/url"
)

func main() {

	http.HandleFunc("/beacon/", func(w http.ResponseWriter, req *http.Request) {
		params := req.URL.Query()
		log.Println(prettyString(params))
		w.Write([]byte(""))
	})

	err := http.ListenAndServe(":9999", nil)
	if err != nil {
		log.Println(err.Error())
	}

}

func prettyString(vals url.Values) string {
	out := ""
	for val := range vals {
		out = out + val + "\t:\t" + vals.Get(val) + "\n"
	}
	return out
}

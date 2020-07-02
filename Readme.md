# Preparation

First insert the following to the page:

```
const script = document.createElement('script')
script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js'
document.body.appendChild(script)


const axiosScript = document.createElement('script')
axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
document.body.appendChild(axiosScript)
```

Start the server using `npm start`


# Process

Just insert this to the console:
```
html2canvas(document.querySelector(".viewerPages"),{useCORS:!0}).then(function(e){return e.toDataURL("image/png")}).then(e=>{return axios.post("http://localhost:3000/",e,{headers:{"Content-Type":"text/plain"},responseType:"text"}).catch(e=>{console.error("error!",e)}).then(e=>{console.log(e.data)})});
```

Minified version saving by link:
```
axios.post("http://localhost:3000/links",Array.from(document.querySelectorAll(".pages-wrapper img")).map(r=>r.currentSrc)).catch(r=>{console.error("error!",r)}).then(r=>{console.log(r.data)});
```


Once you see `file x.png pending` you may click next till you reach the end

# Misc

Full snippet version:

```
html2canvas(document.querySelector('.viewerPages'), { useCORS: true }).then(function(canvas) {
  return canvas.toDataURL("image/png")
}).then(text => {
  const config = {
    headers: {
      'Content-Type': 'text/plain'
    },
    responseType: 'text'
  }
    return axios.post('http://localhost:3000/', text, config)
    .catch(e => {
      console.error('error!', e)
    })
    .then(response => {
      console.log(response.data)
    })
})
```

Save file by link snippet:

```
axios.post('http://localhost:3000/links', Array.from(document.querySelectorAll('.pages-wrapper img')).map(img => img.currentSrc))
  .catch(e => {
    console.error('error!', e)
  })
  .then(response => {
    console.log(response.data)
  })
```
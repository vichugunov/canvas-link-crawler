# Preparation

1. install [node](https://nodejs.org/en/download/) and wget, or (if you're mac user):
```
brew install node
```

2. Open up target page and open developer tools (`cmd + option + I` or `F12` on windows)
3. On the target page insert once the following to the console:

```
const script = document.createElement('script')
script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js'
document.body.appendChild(script)


const axiosScript = document.createElement('script')
axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
document.body.appendChild(axiosScript)
```

4. go back to your terminal, where you have downloaded this source and run the following:

```
npm install 
npm start
```

5. Go back to your browser with opened console

# Process

On every next page just insert this to the console in your browser: (for https://eleteca.edinumen.es)

```
html2canvas(document.querySelector(".viewerPages"),{useCORS:!0}).then(function(e){return e.toDataURL("image/png")}).then(e=>{return axios.post("http://localhost:3000/",e,{headers:{"Content-Type":"text/plain"},responseType:"text"}).catch(e=>{console.error("error!",e)}).then(e=>{console.log(e.data)})});
```

NB. For another purposes use this minified version saving by link: ( for https://campus.difusion.com/ )
```
axios.post("http://localhost:3000/links",Array.from(document.querySelectorAll(".pages-wrapper img")).map(r=>r.currentSrc)).catch(r=>{console.error("error!",r)}).then(r=>{console.log(r.data)});
```


Once you see `file x.png pending` you may click next till you reach the end

# Combine

To obtain pdf you need to run in your terminal:

```
npm run combine
```

If you want to combine & minimize use of these commands:

```
npm run combine:png:min
npm run combine:jpg:min
```

They will appear just in the root directory. After that you can run `npm run clean` to remove image files

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

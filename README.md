# Web-soins Consultations

This is the client application for consultations.

![image](https://user-images.githubusercontent.com/3356894/123622454-835c3f00-d80c-11eb-9577-dac42fb4b7ac.png)
![image](https://user-images.githubusercontent.com/3356894/123622512-95d67880-d80c-11eb-9218-427b7670b148.png)


## Deployment

```bash
npm run deploy
```

This will build the project, create a `package.txt` file with the checksum of all the files and send all this on gh-pages.
`package.txt` looks like this:

```
c02f1ef5a68d32e3d75b42ccf1eb5db7188d4c2b6677022ad598b9e5e6b5325e  ./package.json
9ea4f4da7050c0cc408926f6a39c253624e9babb1d43c7977cd821445a60b461  ./logo512.png
b89b7e47317829c407c13435d1a5c6a8b3b1dec6d88d4e0e45d17ea587ef1b99  ./static/media/wheel.d73f403c.png
3d91f7aa69cb7f7064035895c566ac5cb9b2084582d351af7267bb4e0fba60f5  ./static/media/Roboto-Thin.89e2666c.ttf
```

This is the first file read by the [upgrader script](upgrader/README.md).

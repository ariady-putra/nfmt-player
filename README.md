# nfmt-player
- Non-fungible music token player
- A working demo is located at https://nfmt-player.azurewebsites.net
- A recorded demo is located at https://youtu.be/lz58KuQK9hI
<img src="screenshots/0_HomePage0.png"/>

## The NFT Metadata must have the following tags
```json
{
  "721": {
    "PolicyID": {
      "AssetName": {
        ...
        "song_title": "Song Title",
        "artists": "Artists",
        "files": [
          {
            "mediaType": "audio/mp3",
            "src": "ipfs://songURL"
          }
        ],
        "image": "ipfs://coverURL",
        "name": "Alt Name",
        "copyright": "Copyright (c) year",
        ...
      }
    }
  }
}
```

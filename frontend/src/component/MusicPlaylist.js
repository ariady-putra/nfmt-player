import React from "react";

function MusicPlaylist({ library, disconnect }) {
  const [song, setSong] = React.useState();
  const [search, setSearch] = React.useState(() => "");

  const filteredLib = library.filter((music) => {
    if (!search) return true;

    const keyword = search.toUpperCase();

    if (match(keyword, `${music.song_title}`)) return true;
    if (match(keyword, `${music.artists}`)) return true;
    // if (match(keyword, `${music.album_title}`)) return true;
    // if (match(keyword, `${music.name}`)) return true;
    // if (match(keyword, `${music.copyright}`)) return true;
    // if (match(keyword, `${music.distributor}`)) return true;
    // if (match(keyword, `${music.genres}`)) return true;
    // if (match(keyword, `${music.release_type}`)) return true;
    // if (match(keyword, `${music.song_duration}`)) return true;
    // if (match(keyword, `${music.collection}`)) return true;
    // if (match(keyword, `${music.music_metadata_version}`)) return true;

    return false;
  });

  function match(keyword, field) {
    try {
      return field != null && field.toUpperCase().includes(keyword);
    } catch {
      return false;
    }
  }

  async function play(music) {
    // const cdn = await fetch(`/cdn/imageUrl?fingerprint=${music.fingerprint}`);
    // const img = await cdn.json();
    // console.log(img.url); // need mainnet key
    setSong(); // force reset song each time
    setTimeout(() => setSong(music), 1);
  }

  return (
    <div className="MusicPlaylist">
      <table style={{ width: "100%", height: window.innerHeight, borderSpacing: "0px", tableLayout: "fixed" }}>
        <tbody>
          <tr>
            <td style={{ width: "25%", height: "100%", padding: "0px 0px 0px 0px" }}>
              <table style={{ width: "100%", height: "100%", borderSpacing: "0px", tableLayout: "fixed" }}>
                <tbody>
                  {/* Search Box */}
                  <tr>
                    <td className="BoxShadow" style={{ verticalAlign: "middle", padding: "0px 0px 0px 0px" }}>
                      <div style={{ overflow: "clip" }}>
                        <input className="SearchBox" placeholder="Search" type="text" value={search} onChange={(search) => setSearch(search.target.value)} />
                      </div>
                    </td>
                  </tr>

                  {/* Song List */}
                  <tr style={{ height: "100%" }}>
                    <td className="BoxShadow" style={{ verticalAlign: "top", padding: "0px 0px 0px 0px" }}>
                      <div style={{ height: "100%", overflow: "auto" }}>
                        {filteredLib.map((music) => (
                          <button key={music.name} onClick={() => play(music)}>
                            <table>
                              <tbody>
                                <tr>
                                  <td className="SongTitle">{`${music.song_title}`}</td>
                                </tr>
                                <tr>
                                  <td className="SongArtists">{`${music.artists}`}</td>
                                </tr>
                              </tbody>
                            </table>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* Disconnect Button */}
                  <tr>
                    <td className="BoxShadow" style={{ verticalAlign: "middle", padding: "0px 0px 0px 0px" }}>
                      <button onClick={() => disconnect()}>Disconnect</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Main Content */}
            <td className="BoxShadow" style={{ width: "75%", height: "100%", verticalAlign: "middle", padding: "0px 0px 0px 0px" }}>
              <div className="MusicPlaylistBg">
                {!library.length
                  ? "No music NFT was found from this wallet :-("
                  : song && (
                      <div style={{ maxHeight: window.innerHeight, overflow: "auto" }}>
                        <h1>{`${song.song_title}`}</h1>
                        <h2>{`${song.artists}`}</h2>
                        <img
                          className="BoxShadow"
                          src={`https://gateway.pinata.cloud/ipfs/${song.image.replace("ipfs://", "")}`}
                          alt={`${song.name}`}
                          height={document.documentElement.clientHeight / 2}
                        />
                        <br />
                        <sup>{`${song.copyright}`}</sup>
                        <br />
                        <audio autoPlay={true} controls={true} onEnded={() => play(filteredLib[Math.floor(Math.random() * filteredLib.length)])}>
                          <source src={`https://gateway.pinata.cloud/ipfs/${song.files[0].src.replace("ipfs://", "")}`} type={song.files[0].mediaType} />
                          {"Your browser does not support the audio element :-("}
                        </audio>
                      </div>
                    )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MusicPlaylist;

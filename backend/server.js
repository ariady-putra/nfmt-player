const { BlockFrostAPI } = require("@blockfrost/blockfrost-js");
async function run(api, rsp) {
  try {
    rsp.json(await api);
  } catch (x) {
    rsp.json(x);
  }
}

var API;

const { env } = require("process");
const express = require("express");
const app = express();
app.listen((env.HEROKU && env.PORT) || 55555, () => {
  // const { exec } = require("child_process");
  // exec('cat ~/cardano/cfg/pid.bf', (x,o,e) => {
  API = new BlockFrostAPI({
    // o == null || o.trim().length == 0 ?
    projectId: env.BF_PID, // : o.trim()
  });
  // });
});

const path = require("path");
const { assetcdn } = require("./svc/_");
const frontendBuild = "../frontend/build";
app.use(express.static(path.resolve(__dirname, frontendBuild)));

app.get("/latestBlock", function (_req, _rsp) {
  run(API.blocksLatest(), _rsp);
});

app.get("/networkInfo", function (_req, _rsp) {
  run(API.network(), _rsp);
});

app.get("/latestEpoch", function (_req, _rsp) {
  run(API.epochsLatest(), _rsp);
});

app.get("/protocolParameters", function (_req, _rsp) {
  async function getLatestEpochProtocolParametersFor(_rsp) {
    const { epoch } = await API.epochsLatest();
    run(API.epochsParameters(epoch), _rsp);
  }
  getLatestEpochProtocolParametersFor(_rsp);
});

app.get("/health", function (_req, _rsp) {
  run(API.health(), _rsp);
});

app.get("/pools", function (_req, _rsp) {
  run(API.pools({ order: "desc" }), _rsp);
});

app.get("/specificAsset", function (_req, _rsp) {
  const policyID = _req.query.policy_id;
  const assetName = _req.query.asset_name;
  run(API.assetsById(policyID + assetName), _rsp);
});

//#region AssetCDN
app.get("/cdn/imageUrl", function (_req, _rsp) {
  const assetFingerprint = _req.query.fingerprint;
  assetcdn
    .getImgUrl(assetFingerprint)
    .then((rsp) => _rsp.json({ url: rsp }))
    .catch((error) => _respondError(_rsp, error));
});
app.get("/cdn/assetMetadata", function (_req, _rsp) {
  const assetFingerprint = _req.query.fingerprint;
  assetcdn
    .getMetadataJson(assetFingerprint)
    .then((rsp) => _rsp.json(rsp))
    .catch((error) => _respondError(_rsp, error));
});
function _respondError(resp, error) {
  resp.status(error.status_code ?? 500);
  resp.json({
    error: error.message ?? error,
  });
}
//#endregion

app.get("*", function (_req, _rsp) {
  // Any other GET requests
  _rsp.sendFile(path.resolve(__dirname, frontendBuild, "index.html"));
});

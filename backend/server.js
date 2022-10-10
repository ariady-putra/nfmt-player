const { BlockFrostAPI } = require('@blockfrost/blockfrost-js');
async function run(api, rsp) {
  rsp.json(await api);
}

var API;

const { env } = require('process');
const express = require('express');
const app     = express();
app.listen(env.HEROKU && env.PORT || 55555, () => {
  const { exec } = require('child_process');
  exec('cat ~/cardano/cfg/pid.bf', (x,o,e) => {
    API = new BlockFrostAPI({
      projectId: o == null || o.trim().length == 0 ?
        env.BF_PID : o.trim()
    });
  });
});

const path = require('path');
const frontendBuild = '../frontend/build';
app.use(express.static(path.resolve(__dirname, frontendBuild)));

app.get('/latestBlock', function(req, rsp) {
  run(API.blocksLatest(), rsp);
});

app.get('/networkInfo', function(req, rsp) {
  run(API.network(), rsp);
});

app.get('/latestEpoch', function(req, rsp) {
  run(API.epochsLatest(), rsp);
});

app.get('/protocolParameters', function(req, rsp) {
  async function getLatestEpochProtocolParametersFor(rsp) {
    const { epoch } = await API.epochsLatest();
    run(API.epochsParameters(epoch), rsp);
  }
  getLatestEpochProtocolParametersFor(rsp);
});

app.get('/health', function(req, rsp) {
  run(API.health(), rsp);
});

app.get('/pools', function(req, rsp) {
  run(API.pools({ order: 'desc' }), rsp);
});

app.get('/specificAsset', function(req, rsp) {
  const policyID  = req.query.policy_id;
  const assetName = req.query.asset_name;
  run(API.assetsById(policyID + assetName), rsp);
});

app.get('*', function(req, rsp) { // Any other GET requests
  rsp.sendFile(path.resolve(__dirname, frontendBuild, 'index.html'));
});


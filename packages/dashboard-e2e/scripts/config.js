process.env.BUILD_PATH = process.env.BUILD_PATH || '../dashboard-e2e/build';
process.env.REACT_APP_TRAJECTORY_SERVER =
  process.env.REACT_APP_TRAJECTORY_SERVER || 'ws://157.90.235.4:31086';
process.env.REACT_APP_RMF_SERVER = process.env.REACT_APP_RMF_SERVER || 'http://157.90.235.4:31080';
process.env.E2E_DASHBOARD_URL = process.env.E2E_DASHBOARD_URL || 'http://157.90.235.4:31050';

const services = [];
// eslint-disable-next-line no-eval
if (!eval(process.env.E2E_NO_DASHBOARD)) {
  services.push('serve build');
}
// eslint-disable-next-line no-eval
if (!eval(process.env.E2E_NO_RMF_SERVER)) {
  services.push('npm run start:rmf-server');
}

module.exports = {
  services,
};

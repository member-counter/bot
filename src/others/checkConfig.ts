function checkConfig() {
  let isProperlyConfigured = false;
  
  // TODO check .env
  isProperlyConfigured = true;

  if (!isProperlyConfigured) {
    console.error("Some env vars are not properly configured, bot stopped");
    process.exit(1);
  };
}

export default checkConfig;
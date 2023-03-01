const errorLogHeadRegexp = /^(E)\s+(\d{1,2})\s+(\d+)/;
const otherLogHeadRegexp = /^(W|I)\s+(\d+)/;
const logBodyRegexp = /\s+(.+)$/;
const logHeadRegexp = new RegExp(
  errorLogHeadRegexp.source + "|" + otherLogHeadRegexp.source
);
const singleLogRegexp = new RegExp(
  errorLogHeadRegexp.source +
    logBodyRegexp.source +
    "|" +
    otherLogHeadRegexp.source +
    logBodyRegexp.source
);
const logRegexp = new RegExp(singleLogRegexp.source, "gm");

module.exports = {
  errorLogHeadRegexp,
  otherLogHeadRegexp,
  logBodyRegexp,
  logHeadRegexp,
  singleLogRegexp,
  logRegexp,
};

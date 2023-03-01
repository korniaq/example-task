const {
  errorLogHeadRegexp,
  otherLogHeadRegexp,
  singleLogRegexp,
  logRegexp,
} = require("../../utils/validators");

describe("Validators", () => {
  describe("errorLogHeadRegexp", () => {
    it("should match a string starting with 'E', followed by 1 or 2 digits, followed by 1 or more digits", () => {
      const str = "E 12 3456789 This is an error message";
      const match = str.match(errorLogHeadRegexp);
      expect(match).toBeTruthy();
    });

    it("should not match a string starting with 'E', followed by more than 2 digits", () => {
      const str = "E 1234 56789 This is an error message";
      const match = str.match(errorLogHeadRegexp);
      expect(match).toBeFalsy();
    });

    it("should not match a string starting with 'W'", () => {
      const str = "W 12 3456789 This is a warning message";
      const match = str.match(errorLogHeadRegexp);
      expect(match).toBeFalsy();
    });
  });

  describe("otherLogHeadRegexp", () => {
    it("should match a string starting with 'W', followed by 1 or more digits", () => {
      const str = "W 123456789 This is a warning message";
      const match = str.match(otherLogHeadRegexp);
      expect(match).toBeTruthy();
    });

    it("should match a string starting with 'I', followed by 1 or more digits", () => {
      const str = "I 123456789 This is an informational message";
      const match = str.match(otherLogHeadRegexp);
      expect(match).toBeTruthy();
    });

    it("should not match a string starting with 'E'", () => {
      const str = "E 12 3456789 This is an error message";
      const match = str.match(otherLogHeadRegexp);
      expect(match).toBeFalsy();
    });
  });

  describe("singleLogRegexp", () => {
    it("should match a string starting with 'E', followed by 1 or 2 digits, followed by 1 or more digits, followed by a log message", () => {
      const str = "E 12 3456789 This is an error message";
      const match = str.match(singleLogRegexp);
      expect(match).toBeTruthy();
    });

    it("should match a string starting with 'W', followed by 1 or more digits, followed by a log message", () => {
      const str = "W 123456789 This is a warning message";
      const match = str.match(singleLogRegexp);
      expect(match).toBeTruthy();
    });

    it("should match a string starting with 'I', followed by 1 or more digits, followed by a log message", () => {
      const str = "I 123456789 This is an informational message";
      const match = str.match(singleLogRegexp);
      expect(match).toBeTruthy();
    });

    it("should not match a string starting with 'E', followed by more than 2 digits", () => {
      const str = "E 1234 56789 This is an error message";
      const match = str.match(singleLogRegexp);
      expect(match).toBeFalsy();
    });
  });

  describe("logRegexp", () => {
    it("should match a multi-line string containing a mixture of log messages", () => {
      const str =
        "E 12 3456789 This is an error message\nW 123456789 This is a warning message\nI 123456789 This is an informational message";
      const matches = str.match(logRegexp);
      expect(matches).toBeTruthy();
      expect(matches.length).toBe(3);
      expect(matches[0]).toBe("E 12 3456789 This is an error message");
      expect(matches[1]).toBe("W 123456789 This is a warning message");
      expect(matches[2]).toBe("I 123456789 This is an informational message");
    });

    it("should not match a string that does not contain any log messages", () => {
      const str = "This is not a log message";
      const matches = str.match(logRegexp);
      expect(matches).toBeFalsy();
    });
  });
});

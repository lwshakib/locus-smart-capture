declare module 'screenshot-desktop' {
  interface ScreenshotOptions {
    filename?: string;
    format?: string;
    screen?: number | string;
  }

  /**
   * Takes a screenshot and returns a Promise that resolves to a Buffer (if no filename)
   * or the filepath (if filename is provided).
   */
  function screenshot(options?: ScreenshotOptions): Promise<Buffer | string>;

  /**
   * Lists all available displays.
   */
  namespace screenshot {
    function listDisplays(): Promise<any[]>;
  }

  export = screenshot;
}

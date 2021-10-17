export default interface IImageProcessingProvider {
  compress(filePath: string): Promise<string>;
}

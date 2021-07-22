import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({}: IParseMailTemplateDTO): Promise<string> {
    return 'Mail Content';
  }
}

export default FakeMailTemplateProvider;

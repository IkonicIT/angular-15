export class AppConfiguration {
  public static companyRestURL = 'http://localhost:8085/api/company/';
  public isProd = false;
  public static vendorRestURL = 'http://localhost:8087/api/v1/vendor/';
  public static vendorNoteURL = 'http://localhost:8088/api/vendor/note';
  public static templateRestURL = 'http://localhost:8085/api/v1/template/';
  public static typeStatusRestURL = 'http://localhost:8088/api/';
  public static typeRestURL = 'http://localhost:8088/api/type';
  public static attributeRestURL =
    'http://localhost:8088/api/attributeName';
  public static locationRestURL = 'http://localhost:8087/api/v1/';
  public static oauthURL = 'http://localhost:8081/oauth/token';
  public static vendorAttachments =
    'http://localhost:8088/api/vendor/attachment';

  public static forgotPasswordURL =
    'http://localhost:8085/api/v1/password/';
  public static cliffsURL = 'http://localhost:8088';
}

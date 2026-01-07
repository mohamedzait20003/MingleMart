using UAParser;
using MaxMind.GeoIP2;

namespace App.Services
{
    public class DeviceInfo
    {
        public string Location { get; set; } = string.Empty;
        public string DeviceType { get; set; } = string.Empty;
        public string OperatingSystem { get; set; } = string.Empty;
    }

    public class DetectionService
    {
        private readonly Parser _uaParser;
        private readonly WebServiceClient  _geoClient;

        public DetectionService(IConfiguration configuration)
        {
            _uaParser = Parser.GetDefault();
            var accountId = configuration.GetValue<int>("GeoIP:AccountId");
            var licenseKey = configuration.GetValue<string>("GeoIP:LicenseKey");

            if (string.IsNullOrEmpty(licenseKey))
            {
                throw new ArgumentException("GeoIP:LicenseKey is not set in configuration");
            }

            _geoClient = new WebServiceClient(accountId, licenseKey);
        }

        public async Task<DeviceInfo> GetDeviceInfo(HttpContext context)
        {
            var userAgent = context.Request.Headers["User-Agent"].ToString();
            var location = await GetLocation(context);
            
            var clientInfo = _uaParser.Parse(userAgent);
            
            return new DeviceInfo
            {
                Location = location,
                DeviceType = GetDeviceType(clientInfo),
                OperatingSystem = $"{clientInfo.OS.Family} {clientInfo.OS.Major}".Trim()
            };
        }

        private async Task<string> GetLocation(HttpContext context)
        {
            try {

                var ip = context.Connection.RemoteIpAddress?.ToString();
        
                if (ip == "::1"){
                    ip = "127.0.0.1";
                }
                
                if (string.IsNullOrEmpty(ip)){
                    return "Unknown";
                }


                var Response = await _geoClient.CityAsync(ip);

                var country = Response.Country?.Name ?? "Unknown";
                var state = Response.MostSpecificSubdivision?.Name ?? "Unknown";
                var city = Response.City?.Name ?? "Unknown";
                
                return $"{country}, {state}, {city}";
            } catch {
                return "Unknown";
            }

        }

        private string GetDeviceType(ClientInfo clientInfo)
        {
            var device = clientInfo.Device.Family.ToLower();
            
            if (device.Contains("spider") || device.Contains("bot"))
                return "Bot";
            if (device.Contains("tablet") || device.Contains("ipad"))
                return "Tablet";
            if (device.Contains("mobile") || device.Contains("phone"))
                return "Mobile";
            
            return "Desktop";
        }
    }
}
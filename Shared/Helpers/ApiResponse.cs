namespace Shared.Helpers
{
    public class ApiResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public object Error { get; set; }
        public string Detail { get; set; }

        public ApiResponse(int statusCode, string message, object data = default, object error = null, string detail = null)
        {
            StatusCode = statusCode;
            Message = message;
            Data = data;
            Error = error;
            Detail = detail;
        }
    }
}

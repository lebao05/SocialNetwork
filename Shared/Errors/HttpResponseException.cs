namespace Shared.Errors
{
    public class HttpResponseException : Exception
    {
        public int StatusCode { get; }
        public object Value { get; }
        public HttpResponseException(int statusCode, string message, object? value = null)
        : base(message)
        {
            StatusCode = statusCode;
            Value = value;
        }
    }
}

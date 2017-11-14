using System.Threading.Tasks;
using EasyDash.Models;

namespace EasyDash.Services
{
    public interface ITestRunner<S, T>
    {
        Task<S> Test(T configuration);
    }
}
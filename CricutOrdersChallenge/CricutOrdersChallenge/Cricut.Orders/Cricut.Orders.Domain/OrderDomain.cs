using Cricut.Orders.Domain.Models;

namespace Cricut.Orders.Domain
{
    public interface IOrderDomain
    {
        Task<Order> CreateNewOrderAsync(Order order);

        Task<Order> FetchOrderAsync(int orderId);
    }

    public class OrderDomain : IOrderDomain
    {
        private readonly IOrderStore _orderStore;

        public OrderDomain(IOrderStore orderStore)
        {
            _orderStore = orderStore;
        }

        public async Task<Order> CreateNewOrderAsync(Order order)
        {
            var updatedOrder = await _orderStore.SaveOrderAsync(order);
            return updatedOrder;
        }

        public async Task<Order> FetchOrderAsync(int orderId)
        {
            var theOrder = await _orderStore.GetOrderByIdAsync(orderId);
            return theOrder;
        }
    }
}

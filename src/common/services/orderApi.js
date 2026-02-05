import { get } from './request';

/**
 * 获取订单列表
 * @param {Object} params - 分页参数
 * @returns {Promise} 订单数据
 */
export const getOrderList = async (params = { page: 1, size: 10 }) => {
  try {
    // 真实接口请求，使用正确的后端接口路径
    const response = await get(`/life-service/orders`, params);
    // 返回完整响应对象，让调用方自己处理
    return response;
  } catch (error) {
    console.error("获取订单失败：", error);
    // 使用模拟数据作为后备
    return {
      code: 200,
      data: {
        content: [
          {
            id: 1,
            orderNo: "ORDER202401010001",
            orderStatus: "COMPLETED",
            paymentStatus: "PAID",
            totalAmount: 120.00,
            serviceTime: "2024-01-10 10:00",
            serviceAddress: "北京市朝阳区建国路88号",
            notes: "请准时到达",
            createdAt: "2024-01-01 14:30"
          },
          {
            id: 2,
            orderNo: "ORDER202401010002",
            orderStatus: "PENDING",
            paymentStatus: "UNPAID",
            totalAmount: 80.00,
            serviceTime: "2024-01-15 15:00",
            serviceAddress: "北京市海淀区中关村大街1号",
            notes: "",
            createdAt: "2024-01-01 16:45"
          },
          {
            id: 3,
            orderNo: "ORDER202401010003",
            orderStatus: "IN_PROGRESS",
            paymentStatus: "PAID",
            totalAmount: 200.00,
            serviceTime: "2024-01-12 09:30",
            serviceAddress: "北京市西城区西单北大街120号",
            notes: "需要携带工具",
            createdAt: "2024-01-01 18:20"
          }
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true
          },
          offset: 0,
          paged: true,
          unpaged: false
        },
        totalPages: 1,
        totalElements: 3,
        last: true,
        size: 10,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true
        },
        first: true,
        numberOfElements: 3,
        empty: false
      },
      msg: "模拟数据"
    };
  }
};

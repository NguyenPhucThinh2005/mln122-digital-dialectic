export interface GlossaryItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const glossaryData: Record<string, GlossaryItem> = {
  panopticon: {
    id: 'panopticon',
    title: 'Nhà Tù Panopticon',
    description: 'Một thiết kế nhà tù bới Jeremy Bentham, nơi một người gác ngục ở tháp trung tâm có thể quan sát mọi tù nhân, nhưng tù nhân không thể nhìn thấy người gác ngục. Michel Foucault dùng nó làm ẩn dụ cho xã hội giám sát hiện đại, khi con người bị theo dõi liên tục khiến họ tự giác kiểm duyệt hành vi. Trên mạng, các nền tảng chính là tháp trung tâm.',
    image: '/images/panopticon.jpg'
  },
  "surplus-value": {
    id: 'surplus-value',
    title: 'Giá Trị Thặng Dư',
    description: 'Khái niệm cốt lõi của Karl Marx. Đây là phần giá trị mới dôi ra ngoài giá trị sức lao động do công nhân làm ra và bị nhà tư bản chiếm không. Trong nền kinh tế số, các tài xế công nghệ (shipper) làm việc cực nhọc nhưng phần lớn thù lao bị nền tảng "cắt phế" - chính là hình thức bóc lột giá trị thặng dư hiện đại.',
    image: '/images/surplus_value.jpg'
  },
  simulacra: {
    id: 'simulacra',
    title: 'Thực Tại Ảo (Simulacra)',
    description: 'Theo Jean Baudrillard, Simulacra là những bản sao vô thực thay thế hoàn toàn thực tại nguyên bản. Trong kỷ nguyên số, lượt Like, View, hay vật phẩm ảo trong game dần mang giá trị thật, che mờ và thậm chí thay thế ý nghĩa của các vật chất hữu hình.',
    image: '/images/simulacra.jpg'
  },
  "invisible-hand": {
    id: 'invisible-hand',
    title: 'Bàn Tay Vô Hình',
    description: 'Theo Adam Smith, thị trường tự do được dẫn dắt bởi một "bàn tay vô hình", tự động điều tiết cung cầu và giá cả mang lại lợi ích chung. Ngày nay, bàn tay vô hình đã được thay thế bằng "Thuật toán" của các ông lớn công nghệ.',
    image: '/images/Invisible_Hand.jpg'
  },
  "alienation": {
    id: 'alienation',
    title: 'Sự Tha Hóa',
    description: 'Theo Karl Marx, tha hóa xảy ra khi con người mất quyền kiểm soát đối với sản phẩm do chính mình làm ra, bị lệ thuộc vào công cụ sản xuất. Trên không gian mạng, chúng ta bị tha hóa khi trở thành nô lệ của thuật toán và các lượt like.',
    image: '/images/Alienation.jpg'
  },
  "attention-economy": {
    id: 'attention-economy',
    title: 'Nền Kinh Tế Sự Chú Ý',
    description: 'Trong thời đại quá tải thông tin, sự chú ý của con người trở thành loại hàng hóa khan hiếm và đắt giá nhất. Các nền tảng sử dụng Dark Patterns để tối đa hóa thời gian bạn dán mắt vào màn hình, sau đó "bán" sự chú ý đó cho các nhà quảng cáo.',
    image: '/images/Attention_Economy.jpg'
  },
  "bandwagon-effect": {
    id: 'bandwagon-effect',
    title: 'Hiệu Ứng Bầy Đàn',
    description: 'Hiện tượng tâm lý khi mọi người làm theo số đông mà không suy xét độc lập. Lợi dụng điều này, các tính năng như "1.000+ người đã mua" hoặc Fake Social Proof được sinh ra để thúc đẩy bạn ra quyết định mua hàng một cách bốc đồng.',
    image: '/images/Bandwagon-Effect.jpg'
  },
  "sunk-cost": {
    id: 'sunk-cost',
    title: 'Chi Phí Chìm',
    description: 'Chi phí chìm (Sunk Cost) là những nỗ lực, thời gian hoặc tiền bạc bạn đã lỡ đầu tư và không thể lấy lại. Tâm lý tiếc nuối chi phí chìm khiến bạn tiếp tục lướt các ứng dụng vô bổ vì "đã lỡ xây dựng profile" hoặc "đã chơi tới cấp này rồi".',
    image: '/images/Sunk_Cost_Fallacy_2.jpg'
  }
};

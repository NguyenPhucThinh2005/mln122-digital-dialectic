import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Briefcase, Package, Store, Share2, Truck } from 'lucide-react';

import { TitleReveal } from './TitleReveal';

type Role = 'seller' | 'affiliate' | 'shipper' | null;

export const Section4: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const roleData = {
    seller: {
      title: 'Làm Chủ Shop',
      icon: Store,
      opp: 'Mở rộng thị trường không giới hạn, chi phí mặt bằng bằng 0.',
      risk: 'Cuộc chiến về giá, bị nền tảng ép chiết khấu phí sàn liên tục.',
      skill: 'Kỹ năng tối ưu hiển thị (SEO), phân tích dữ liệu bán hàng.'
    },
    affiliate: {
      title: 'Làm Affiliate',
      icon: Share2,
      opp: 'Không cần nhập hàng, thu nhập thụ động từ việc sáng tạo nội dung.',
      risk: 'Phụ thuộc 100% vào thuật toán phân phối nội dung của nền tảng.',
      skill: 'Sáng tạo nội dung (Content creator), nhạy bén xu hướng.'
    },
    shipper: {
      title: 'Làm Shipper / NV giao vận',
      icon: Truck,
      opp: 'Việc làm linh hoạt, rào cản gia nhập thấp.',
      risk: 'Không có bảo hiểm lao động, chịu rủi ro bom hàng, tai nạn.',
      skill: 'Sức khỏe tốt, kỹ năng giao tiếp và xử lý tình huống.'
    }
  };

  return (
    <section className="w-full min-h-screen bg-transparent py-32 px-6 flex flex-col items-center">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <TitleReveal>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white flex flex-wrap gap-x-3 justify-center">
            <span className="word-animate inline-block">Góc</span>
            <span className="word-animate inline-block">Nhìn</span>
            <span className="word-animate inline-block">Thực</span>
            <span className="word-animate inline-block">Tiễn</span>
            <span className="word-animate inline-block">Dành</span>
            <span className="word-animate inline-block">Cho</span>
            <span className="word-animate inline-block text-orange-500">Sinh</span>
            <span className="word-animate inline-block text-orange-500">Viên</span>
          </h2>
        </TitleReveal>
        <p className="text-xl text-stone-300">
          Nền kinh tế số đang viết lại "Mối quan hệ lợi ích". Quét mã QR dưới đây để tham gia bình chọn trên điện thoại của bạn: <br/> 
          <strong className="text-white">"Bạn sẽ chọn vai trò nào khi bước chân vào nền kinh tế này?"</strong>
        </p>
      </div>

      {/* QR Code Section */}
      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-12 mb-20 border border-white/10">
        <div className="bg-white/90 p-4 rounded-2xl">
          <QRCodeSVG value="https://forms.gle/placeholder" size={200} />
        </div>
        <div className="text-left space-y-4 max-w-sm">
          <h3 className="text-2xl font-bold text-white">Live Poll</h3>
          <p className="text-stone-300">Sử dụng điện thoại quét mã QR để tham gia bình chọn. Kết quả sẽ giúp chúng ta thấy xu hướng lựa chọn nghề nghiệp của sinh viên trong nền kinh tế nền tảng.</p>
        </div>
      </div>

      {/* Interactive Cards */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {(['seller', 'affiliate', 'shipper'] as Role[]).map((role) => (
          <div 
            key={role}
            onClick={() => setSelectedRole(selectedRole === role ? null : role)}
            className={`cursor-pointer perspective-1000 w-full h-[400px] transition-all duration-500`}
          >
            <div className={`relative w-full h-full duration-700 preserve-3d ${selectedRole === role ? 'rotate-y-180' : ''}`}>
              
              {/* Card Front */}
              <div className="absolute w-full h-full backface-hidden bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 hover:border-orange-500/50 hover:shadow-orange-500/20 transition-all">
                {role === 'seller' && <Briefcase className="w-20 h-20 text-orange-500 mb-6" />}
                {role === 'affiliate' && <Users className="w-20 h-20 text-blue-500 mb-6" />}
                {role === 'shipper' && <Package className="w-20 h-20 text-emerald-500 mb-6" />}
                <h3 className="text-2xl font-bold text-white">
                  {role === 'seller' && 'Chủ Shop'}
                  {role === 'affiliate' && 'KOL / Affiliate'}
                  {role === 'shipper' && 'Giao Vận'}
                </h3>
                <p className="mt-4 text-stone-400 text-sm">(Click để lật thẻ)</p>
              </div>

              {/* Card Back */}
              <div className="absolute w-full h-full backface-hidden bg-black/80 backdrop-blur-3xl border border-white/10 text-white rounded-3xl shadow-2xl p-8 rotate-y-180 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-orange-400 font-bold mb-2 uppercase text-sm tracking-wider">Cơ hội</h4>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {role === 'seller' && roleData.seller.opp}
                      {role === 'affiliate' && roleData.affiliate.opp}
                      {role === 'shipper' && roleData.shipper.opp}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-bold mb-2 uppercase text-sm tracking-wider">Rủi ro</h4>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {role === 'seller' && roleData.seller.risk}
                      {role === 'affiliate' && roleData.affiliate.risk}
                      {role === 'shipper' && roleData.shipper.risk}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-bold mb-2 uppercase text-sm tracking-wider">Năng lực cần thiết</h4>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {role === 'seller' && roleData.seller.skill}
                      {role === 'affiliate' && roleData.affiliate.skill}
                      {role === 'shipper' && roleData.shipper.skill}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* Footer info */}
      <div className="mt-32 text-stone-400 text-sm font-light">
        Sản phẩm sáng tạo - Học phần MLN122
      </div>
    </section>
  );
};

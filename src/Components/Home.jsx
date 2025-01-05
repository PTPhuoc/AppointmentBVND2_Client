import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full h-full gap-5 pb-5">
      <div className="w-full h-[440px] relative">
        <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center text-white">
          <div>
            <p className="text-[48px] font-medium">BỆNH VIỆN NHI ĐỒNG 2</p>
          </div>
          <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
          <div>
            <p className="text-[40px]">THÂN HIỆN NHƯ CHÍNH NGÔI NHÀ CỦA BẠN</p>
          </div>
        </div>
        <img
          className="w-full h-full object-cover"
          src="/Image/BuildingBVND2.jpg"
          alt="Bệnh viện nhi đồng 2"
        />
      </div>
      <div className="flex w-full h-[400px] justify-center">
        <div className="flex-grow flex flex-col justify-center mx-5 h-full border-[4px] border-[#005121] rounded-3xl gap-10 px-5 text-[#00BA4B]">
          <div>
            <p className="text-[30px] font-bold text-[#005121]">
              DỊCH VỤ NỔI BẬT
            </p>
          </div>
          <div>
            <p>
              Khám và điều trị đa khoa: Chuyên về hô hấp, tiêu hóa, thần kinh,
              tim mạch và các bệnh lý khác ở trẻ em.
            </p>
          </div>
          <div>
            <p>
              Phẫu thuật chuyên sâu: Với các kỹ thuật tiên tiến như phẫu thuật
              tim bẩm sinh, chỉnh hình, và ghép tạng.
            </p>
          </div>
          <div>
            <p>
              Cấp cứu 24/7: Luôn sẵn sàng xử lý các tình huống cấp cứu nghiêm
              trọng.
            </p>
          </div>
          <div>
            <button className="flex gap-5 items-center bg-[#005121] rounded-[20px] px-5 py-3 text-white fill-white border-2 border-[#005121] duration-200 ease-linear hover:bg-white hover:text-[#005121] hover:fill-[#005121]">
              <div>DỊCH VỤ CỦA CHÚNG TÔI</div>
              <div className="w-[40px] h-[30px]">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="h-full w-[545px] overflow-hidden rounded-tl-3xl rounded-bl-3xl">
          <img
            className="w-full h-full object-cover"
            src="/Image/doctor-female.jpg"
            alt="Bac si"
          />
        </div>
      </div>
      <div className="h-1 w-full bg-[#005121]"></div>
      <div className="flex flex-col w-full h-[400px] items-center gap-5">
        <div>
          <p className="text-[30px] font-bold text-[#005121]">
            CHÍNH SÁCH CHẤT LƯỢNG
          </p>
        </div>
        <div className="h-1 w-1/4 bg-[#005121]"></div>
        <div className="w-full h-full flex gap-10 justify-center">
          <div className="flex flex-col w-1/4 items-center bg-[#37B96D] text-white justify-center gap-5 px-5 rounded-3xl">
            <div>
              <p>SỨ MẠNG</p>
            </div>
            <div className="w-1/2 h-1 bg-white"></div>
            <div>
              <p className="text-center">
                Xây dựng bệnh viện hiện đại, thân thiện, đảm bảo cung cấp dịch
                vụ chăm sóc sức khỏe hiệu quả, an toàn và chất lượng dựa trên y
                học chứng cứ.
              </p>
            </div>
          </div>
          <div className="flex flex-col w-1/4 items-center bg-[#37B96D] text-white justify-center gap-5 px-5 rounded-3xl">
            <div>
              <p>TẦM NHÌN</p>
            </div>
            <div className="w-1/2 h-1 bg-white"></div>
            <div>
              <p className="text-center">
                Trở thành bệnh viện có tất cả các chuyên khoa về Nhi với chất
                lượng hàng đầu Việt Nam và trong khu vực.
              </p>
            </div>
          </div>
          <div className="flex flex-col w-1/4 items-center bg-[#37B96D] text-white justify-center gap-5 px-5 rounded-3xl">
            <div>
              <p>CAM KẾT THỰC HIỆN</p>
            </div>
            <div className="w-1/2 h-1 bg-white"></div>
            <div>
              <p className="text-center">
                Không ngừng nâng cao chất lượng khám và điều trị, đồng thời đáp
                ứng tốt nhất các nhu cầu cần thiết của bệnh nhân và thân nhân
                bệnh nhân theo pháp luật vầ quy trình hiện hành.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

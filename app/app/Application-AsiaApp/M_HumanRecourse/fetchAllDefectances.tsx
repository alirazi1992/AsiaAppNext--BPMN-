import GetAllProfileDefectances from "@/app/Servises-AsiaApp/M_HumanResources/GetAllProfilesDefectances";

export const userAllProfileDefectances = () => {
  const { Function } = GetAllProfileDefectances();

  const fetchAllDefectances = async () => {
    try {
      const response = await Function();
      if (response.data.status && response.data.data) {
        return response.data.data; // آرایه‌ای از ProfileDefectanceModel
      } else {
        console.warn("خطا در دریافت داده‌ها:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("خطا در درخواست:", error);
      return [];
    }
  };

  return { fetchAllDefectances };
};

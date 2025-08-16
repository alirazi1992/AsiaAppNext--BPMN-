import GetProfileDefectancesOther from "@/app/Servises-AsiaApp/M_HumanResources/GetProfileDefectancesOther";

export const useProfileDefectancesOther = () => {
  const { Function } = GetProfileDefectancesOther();

  const fetchDefectancesOther = async (payload:any) => {
    try {
      const response = await Function(payload);
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

  return { fetchDefectancesOther };
};

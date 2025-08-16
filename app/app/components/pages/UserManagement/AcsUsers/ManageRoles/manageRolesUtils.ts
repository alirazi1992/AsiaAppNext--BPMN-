import { GetRelatedDepartmentList } from "@/app/models/UserManagement/DepartmentModels";

export function getAllDepartmentIds(items: GetRelatedDepartmentList[]): number[] {
  const result: number[] = [];

  function traverse(items: GetRelatedDepartmentList[]) {
    for (const item of items) {
      result.push(item.id);
      if (item.subDepartements?.length) {
        traverse(item.subDepartements);
      }
    }
  }

  traverse(items);
  return result;
}

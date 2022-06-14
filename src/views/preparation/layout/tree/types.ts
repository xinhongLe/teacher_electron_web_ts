import { ICourseItem } from "@/api/resource";
export interface ITreeItem extends ICourseItem {
  Children?: ITreeItem[];
  Candrag?: boolean;
}
export interface ITreeItem {
  name: string;
  id: string;
  children?: ITreeItem[];
  candrag?: boolean;
}
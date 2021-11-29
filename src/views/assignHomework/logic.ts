export function showImg(val: string) {
    switch (val) {
    case "doc":
    case "docx":
        return "icon_word@2x";
    case "png":
    case "jpg":
    case "jpge":
    case "pdf":
        return "icon_pic@2x";
    case "mp3":
    case "mp4":
    case "mkv":
    case "flv":
        return "icon_music@2x";
    default:
        return "icon_other@2x";
    }
}

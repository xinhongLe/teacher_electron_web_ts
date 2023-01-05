interface ImageSize {
    width: number;
    height: number;
}

/**
 * 获取图片的原始宽高
 * @param src 图片地址
 */
export const getImageSize = (src: string): Promise<ImageSize> => {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        img.src = src;
        img.style.opacity = "0";
        document.body.appendChild(img);

        img.onload = () => {
            const imgWidth = img.clientWidth;
            const imgHeight = img.clientHeight;

            img.onload = null;
            img.onerror = null;

            document.body.removeChild(img);

            resolve({ width: imgWidth, height: imgHeight });
        };

        img.onerror = () => {
            img.onload = null;
            img.onerror = null;
        };
    });
};

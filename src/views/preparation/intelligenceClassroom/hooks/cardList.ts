export default () => {
    interface getPage {
        id:string,
        type:number,
    }
    interface CardListItem {
        ID: string,
        Name: string,
        NickName: string,
        OriginType :number,
        TeachPageRelationID: string,
        Width: number,
        Type: number,
        Sort: number,
        Height: number,
        Remark?: string
    }
    interface CardList {
        ID: string,
        Name: string,
        NickName: string,
        Sort: number,
        TeachPageRelationID: string,
        Type: number,
        PageList: CardListItem[]
    }
    const transformType = (type: number | string) => {
        switch (type) {
        case 11:
        case "element":
            return 0;
        case 12:
        case "listen":
            return 1;
        case 13:
        case "follow":
            return 2;
        case 16:
        case "teach":
            return 3;
        default:
            return -1;
        }
    };
    const dealCardData = (card:CardList, originType: number) => {
        const pages = card.PageList.map(page => {
            return {
                ID: page.ID,
                Name: page.Name || ["普通页", "听写页", "跟读页"][page.Type],
                Type: page.Type,
                Steps: [],
                Elements: [],
                Width: page.Width || 1024,
                Height: page.Height || 678,
                BindId: page.TeachPageRelationID,
                Remark: page.Remark || "",
                IsGetData: false,
                originType
            };
        });
        console.log(pages, "pages");
        return {
            id: card.ID,
            name: card.Name,
            pages: pages
        };
    };
    return {
        dealCardData
    };
};

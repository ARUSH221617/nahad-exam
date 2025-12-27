declare module 'pdf-parse/lib/pdf-parse.js' {
    function PDF(dataBuffer: Buffer, options?: any): Promise<{
        numpages: number;
        numrender: number;
        info: any;
        metadata: any;
        text: string;
        version: string;
    }>;
    export = PDF;
}

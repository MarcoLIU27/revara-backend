import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

interface GenerateContractPDFInput {
    currentOwner: string;
    address: string;
    city: string;
    zipCode: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    offerPrice: string;
    earnestMoney: string;
    closingDate: string;
    additionalTerms: string;
    legalDescription: string;
    inspectionPeriod: string;
}

// Function to convert number to ordinal form (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (n: number): string => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
};

const generateDocxFromTemplate = async (templatePath: string, context: any): Promise<Buffer> => {
    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
            start: '{{',
            end: '}}'
        }
    });

    try {
        await doc.renderAsync(context);
    } catch (err: any) {
        console.error('Error rendering DOCX template:', {
            error: err.message,
            properties: err.properties,
            templatePath
        });
        throw new Error(`Template rendering error: ${err.message}`);
    }

    return doc.toBuffer();
};

export const generateContract = async (info: GenerateContractPDFInput): Promise<{ wholesaleAssignment: Buffer; purchaseAndSale: Buffer }> => {
    // Get current date for contract generation
    const currentDate = new Date();
    const currentDay = `${currentDate.getDate()}${getOrdinalSuffix(currentDate.getDate())}`;
    const currentMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentDate.getMonth()];
    const currentYear = currentDate.getFullYear().toString();

    // Split closingDate into day, month, year
    const closingDate = new Date(info.closingDate);

    const context = {
        assignor_name: info.currentOwner || '',
        assignee_name: info.buyerName || '',
        buyer_email: info.buyerEmail || '',
        buyer_phone: info.buyerPhone || '',
        property_address: info.address || '',
        city: info.city || '',
        zip_code: info.zipCode || '',
        purchase_price: info.offerPrice || '',
        earnest_money: info.earnestMoney || '',
        balance_due: (Number(info.offerPrice) - Number(info.earnestMoney)).toString() || '',
        closing_date: closingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || '',
        day: currentDay,
        month: currentMonth,
        year: currentYear,
        legal_description: info.legalDescription || '',
        inspection_period: info.inspectionPeriod || '',
        additional_terms: info.additionalTerms || ''
    };

    const wholesaleAssignmentTemplatePath = path.join(__dirname, '../templates/wholesale_assignment_template.docx');
    const purchaseAndSaleTemplatePath = path.join(__dirname, '../templates/purchase_and_sale_template.docx');

    const [wholesaleAssignmentDocx, purchaseAndSaleDocx] = await Promise.all([
        generateDocxFromTemplate(wholesaleAssignmentTemplatePath, context),
        generateDocxFromTemplate(purchaseAndSaleTemplatePath, context)
    ]);

    return {
        wholesaleAssignment: wholesaleAssignmentDocx,
        purchaseAndSale: purchaseAndSaleDocx
    };
};

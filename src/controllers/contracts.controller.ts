import { NextFunction, Request, Response } from 'express';
import * as ContractsService from '../services/contracts.service';
import JSZip from 'jszip';

export const generateContract = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const {
            currentOwner,
            address,
            city,
            zipCode,
            buyerName,
            buyerEmail,
            buyerPhone,
            offerPrice,
            earnestMoney,
            closingDate,
            additionalTerms,
            legalDescription,
            inspectionPeriod
        } = request.body;

        const { wholesaleAssignment, purchaseAndSale } = await ContractsService.generateContract({
            currentOwner,
            address,
            city,
            zipCode,
            buyerName,
            buyerEmail,
            buyerPhone,
            offerPrice,
            earnestMoney,
            closingDate,
            additionalTerms,
            legalDescription,
            inspectionPeriod
        });

        // Create zip file
        const zip = new JSZip();
        zip.file('wholesale_assignment.docx', wholesaleAssignment);
        zip.file('purchase_and_sale.docx', purchaseAndSale);

        // Generate zip buffer
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        // Send zip file
        response.setHeader('Content-Type', 'application/zip');
        response.setHeader('Content-Disposition', 'attachment; filename=contracts.zip');
        response.send(zipBuffer);
    } catch (error) {
        next(error);
    }
}; 
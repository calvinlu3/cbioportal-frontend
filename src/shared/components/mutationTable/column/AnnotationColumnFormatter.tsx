import * as React from 'react';
import {
    Annotation,
    AnnotationProps,
    annotationSortValue,
    civicDownload,
    getAnnotationData,
    IAnnotation,
    myCancerGenomeDownload,
    oncoKbAnnotationDownload,
} from 'react-mutation-mapper';
import {
    ICivicGeneIndex,
    ICivicVariantIndex,
    IHotspotIndex,
    IMyCancerGenomeData,
    IOncoKbData,
    RemoteData,
} from 'cbioportal-utils';
import OncokbPubMedCache from 'shared/cache/PubMedCache';
import { CancerStudy, Mutation } from 'cbioportal-ts-api-client';
import { CancerGene } from 'oncokb-ts-api-client';
import AnnotationHeader from './annotation/AnnotationHeader';

export interface IAnnotationColumnProps extends AnnotationProps {
    pubMedCache?: OncokbPubMedCache;
    studyIdToStudy?: { [studyId: string]: CancerStudy };
    uniqueSampleKeyToTumorType?: { [sampleId: string]: string };
}

export default class AnnotationColumnFormatter {
    public static sortValue(
        data: Mutation[],
        oncoKbCancerGenes?: RemoteData<CancerGene[] | Error | undefined>,
        hotspotData?: RemoteData<IHotspotIndex | undefined>,
        myCancerGenomeData?: IMyCancerGenomeData,
        oncoKbData?: RemoteData<IOncoKbData | Error | undefined>,
        usingPublicOncoKbInstance?: boolean,
        civicGenes?: RemoteData<ICivicGeneIndex | undefined>,
        civicVariants?: RemoteData<ICivicVariantIndex | undefined>,
        resolveTumorType?: (mutation: Mutation) => string
    ): number[] {
        const annotationData: IAnnotation = getAnnotationData(
            data ? data[0] : undefined,
            oncoKbCancerGenes,
            hotspotData,
            myCancerGenomeData,
            oncoKbData,
            usingPublicOncoKbInstance,
            civicGenes,
            civicVariants,
            resolveTumorType
        );

        return annotationSortValue(annotationData);
    }

    public static download(
        data: Mutation[] | undefined,
        oncoKbCancerGenes?: RemoteData<CancerGene[] | Error | undefined>,
        hotspotData?: RemoteData<IHotspotIndex | undefined>,
        myCancerGenomeData?: IMyCancerGenomeData,
        oncoKbData?: RemoteData<IOncoKbData | Error | undefined>,
        usingPublicOncoKbInstance?: boolean,
        civicGenes?: RemoteData<ICivicGeneIndex | undefined>,
        civicVariants?: RemoteData<ICivicVariantIndex | undefined>,
        resolveTumorType?: (mutation: Mutation) => string
    ) {
        const annotationData: IAnnotation = getAnnotationData(
            data ? data[0] : undefined,
            oncoKbCancerGenes,
            hotspotData,
            myCancerGenomeData,
            oncoKbData,
            usingPublicOncoKbInstance,
            civicGenes,
            civicVariants,
            resolveTumorType
        );

        return [
            `OncoKB: ${oncoKbAnnotationDownload(
                annotationData.oncoKbIndicator
            )}`,
            `CIViC: ${civicDownload(annotationData.civicEntry)}`,
            `MyCancerGenome: ${myCancerGenomeDownload(
                annotationData.myCancerGenomeLinks
            )}`,
            `CancerHotspot: ${annotationData.isHotspot ? 'yes' : 'no'}`,
            `3DHotspot: ${annotationData.is3dHotspot ? 'yes' : 'no'}`,
        ].join(';');
    }

    public static headerRender(name: string, width: number) {
        return <AnnotationHeader name={name} width={width} />;
    }

    public static renderFunction(
        data: Mutation[],
        columnProps: IAnnotationColumnProps
    ) {
        return (
            <Annotation
                mutation={data ? data[0] : undefined}
                {...columnProps}
            />
        );
    }
}

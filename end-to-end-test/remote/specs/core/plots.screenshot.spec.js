var goToUrlAndSetLocalStorage = require('../../../shared/specUtils')
    .goToUrlAndSetLocalStorage;
var waitForNetworkQuiet = require('../../../shared/specUtils')
    .waitForNetworkQuiet;
var assertScreenShotMatch = require('../../../shared/lib/testUtils')
    .assertScreenShotMatch;
var checkElementWithElementHidden = require('../../../shared/specUtils')
    .checkElementWithElementHidden;

const CBIOPORTAL_URL = process.env.CBIOPORTAL_URL.replace(/\/$/, '');

function waitForAndCheckPlotsTab() {
    $('body').moveTo({ xOffset: 0, yOffset: 0 });
    $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed({ timeout: 20000 });
    var res = checkElementWithElementHidden(
        'div[data-test="PlotsTabEntireDiv"]',
        '.popover',
        { hide: ['.qtip'] }
    );
    assertScreenShotMatch(res);
}

describe('plots tab screenshot tests', function() {
    it('plots tab mutation type view', function() {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2&Z_SCORE_THRESHOLD=2&cancer_study_id=brca_tcga&case_set_id=brca_tcga_cnaseq&data_priority=0&gene_list=TP53%20MDM2&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=brca_tcga_gistic&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=brca_tcga_mutations&plots_vert_selection=%7B"selectedDataSourceOption"%3A"rna_seq_v2_mrna_median_Zscores"%7D&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab molecular vs molecular same gene', function() {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2&Z_SCORE_THRESHOLD=2&cancer_study_id=brca_tcga&case_set_id=brca_tcga_cnaseq&data_priority=0&gene_list=TP53%20MDM2&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=brca_tcga_gistic&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=brca_tcga_mutations&plots_horz_selection=%7B"dataType"%3A"MRNA_EXPRESSION"%2C"selectedDataSourceOption"%3A"mrna"%7D&plots_vert_selection=%7B"selectedDataSourceOption"%3A"rna_seq_v2_mrna_median_Zscores"%7D&tab_index=tab_visualize`
        );
        $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed({
            timeout: 20000,
        });
        $('input[data-test="ViewCopyNumber"]').waitForExist();
        $('input[data-test="ViewCopyNumber"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab molecular vs molecular same gene changed gene', function() {
        browser.execute(function() {
            resultsViewPlotsTab.test__selectGeneOption(false, 4193);
        });
        $('input[data-test="ShowRegressionline"]').waitForExist({
            timeout: 10000,
        });
        $('input[data-test="ShowRegressionline"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab copy number view', function() {
        $('input[data-test="ShowRegressionline"]').click();
        $('input[data-test="ViewCopyNumber"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab molecular vs molecular different genes', function() {
        browser.execute(function() {
            resultsViewPlotsTab.test__selectGeneOption(true, 7157);
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab molecular vs molecular different genes different profiles', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'rna_seq_v2_mrna',
            });
        });
        $('input[data-test="ShowRegressionline"]').waitForExist({
            timeout: 3000,
        });
        $('input[data-test="ShowRegressionline"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab molecular vs molecular swapped axes', function() {
        $('input[data-test="ShowRegressionline"]').click();
        $('[data-test="swapHorzVertButton"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab search case id', function() {
        $('input[data-test="ViewMutationType"]').click();
        browser.execute(function() {
            resultsViewPlotsTab.executeSearchCase('TCGA-E2 TCGA-A8-A08G');
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab search case id and mutation', function() {
        browser.execute(function() {
            resultsViewPlotsTab.executeSearchMutation(
                'L321 V2L apsdoifjapsoid'
            );
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab search mutation', function() {
        browser.execute(function() {
            resultsViewPlotsTab.executeSearchCase('');
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab log scale off', function() {
        $('input[data-test="VerticalLogCheckbox"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs molecular', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'clinical_attribute',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'AGE',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs molecular boxplot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'AJCC_PATHOLOGIC_TUMOR_STAGE',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab molecular vs clinical boxplot, mutation search off', function() {
        browser.execute(function() {
            resultsViewPlotsTab.executeSearchMutation('');
        });
        $('[data-test="swapHorzVertButton"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations vs clinical boxplot', function() {
        $('[data-test="swapHorzVertButton"]').click();
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'AGE',
            });
        });
        $('[data-test="swapHorzVertButton"]').click();
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'MUTATION_EXTENDED',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations driver mode vs clinical boxplot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisMutationCountBySelect({
                value: 'DriverVsVUS',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations wild type mode vs clinical boxplot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisMutationCountBySelect({
                value: 'MutatedVsWildType',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs clinical boxplot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onVerticalAxisDataTypeSelect({
                value: 'clinical_attribute',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onVerticalAxisDataSourceSelect({
                value: 'AJCC_PATHOLOGIC_TUMOR_STAGE',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'clinical_attribute',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'AGE',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab search case id in clinical vs clinical boxplot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.executeSearchCase(
                'kjpoij12     TCGA-B6 asdfas TCGA-A7-A13'
            );
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs clinical stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'AJCC_TUMOR_PATHOLOGIC_PT',
            });
        });
        waitForAndCheckPlotsTab();
    });
    //commenting this for now because of https://github.com/zinserjan/wdio-screenshot/issues/87
    /* it("plots tab clinical vs clinical grouped bar plot", function() {
        browser.execute(function() { resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({ value: "Bar" }); });
        waitForAndCheckPlotsTab();
    }); */
    it('plots tab clinical vs clinical percentage stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'PercentageStackedBar',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs clinical horizontal stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'StackedBar',
            });
        });
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs clinical horizontal grouped bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'Bar',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs clinical horizontal percentage stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'PercentageStackedBar',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab clinical vs clinical table plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'Table',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab copy number vs clinical stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'StackedBar',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'COPY_NUMBER_ALTERATION',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab copy number vs clinical horizontal stacked bar plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab copy number vs clinical horizontal percentage stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'PercentageStackedBar',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab copy number vs clinical percentage stacked bar plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab copy number vs clinical table plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'Table',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations wildtype mode vs clinical stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'StackedBar',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisMutationCountBySelect({
                value: 'MutatedVsWildType',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'MUTATION_EXTENDED',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations wildtype mode vs clinical horizontal stacked bar plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations wildtype mode vs clinical horizontal percentage stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'PercentageStackedBar',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations wildtype mode vs clinical percentage stacked bar plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations wildtype mode vs clinical table plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'Table',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations vs clinical stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'StackedBar',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisMutationCountBySelect({
                value: 'MutationType',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations vs clinical horizontal stacked bar plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations vs clinical horizontal percentage stacked bar plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'PercentageStackedBar',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations vs clinical percentage stacked bar plot', function() {
        $('input[data-test="horizontalBars"]').waitForExist();
        $('input[data-test="horizontalBars"]').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab mutations vs clinical table plot', function() {
        browser.execute(function() {
            resultsViewPlotsTab.onDiscreteVsDiscretePlotTypeSelect({
                value: 'Table',
            });
        });
        waitForAndCheckPlotsTab();
    });
    it('plots tab one box clinical vs clinical boxplot', function() {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?cancer_study_id=lgg_ucsf_2014&Z_SCORE_THRESHOLD=2.0&RPPA_SCORE_THRESHOLD=2.0&data_priority=0&case_set_id=lgg_ucsf_2014_sequenced&gene_list=SMARCA4%2520CIC&geneset_list=%20&tab_index=tab_visualize&Action=Submit&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=lgg_ucsf_2014_mutations&show_samples=true&clinicallist=MUTATION_COUNT`
        );
        $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed({
            timeout: 20000,
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'clinical_attribute',
            });
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataSourceSelect({
                value: 'CANCER_TYPE',
            });
        });
        waitForAndCheckPlotsTab();
    });

    it('plots tab mutations profile with duplicates', function() {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?cancer_study_id=msk_impact_2017&Z_SCORE_THRESHOLD=2&RPPA_SCORE_THRESHOLD=2&data_priority=0&case_set_id=msk_impact_2017_Non-Small_Cell_Lung_Cancer&gene_list=TP53&geneset_list=+&tab_index=tab_visualize&Action=Submit&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=msk_impact_2017_mutations&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=msk_impact_2017_cna`
        );
        $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed({
            timeout: 20000,
        });
        browser.execute(function() {
            resultsViewPlotsTab.onHorizontalAxisDataTypeSelect({
                value: 'MUTATION_EXTENDED',
            });
        });
        waitForAndCheckPlotsTab();
    });

    it('plots tab scatter plot color by tumor type', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&plots_coloring_selection=%7B"selectedOption"%3A"undefined_%7B%5C"clinicalAttributeId%5C"%3A%5C"TUMOR_TYPE%5C"%2C%5C"patientAttribute%5C"%3Afalse%2C%5C"studyId%5C"%3A%5C"ccle_broad_2019%5C"%7D"%7D&plots_horz_selection=%7B"dataType"%3A"MRNA_EXPRESSION"%2C"selectedGeneOption"%3A672%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A672%2C"dataType"%3A"TREATMENT_RESPONSE"%2C"selectedGenericAssayOption"%3A"Afatinib-1"%2C"selectedDataSourceOption"%3A"CCLE_drug_treatment_AUC"%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&session_id=5ed80b90e4b030a3bfd0c662&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab scatter plot color by tumor type highlight categories', () => {
        $(`svg#plots-tab-plot-svg .legendLabel_breast`).click();
        $(`svg#plots-tab-plot-svg .legendLabel_glioma`).click();
        waitForAndCheckPlotsTab();
    });

    it('plots tab box plot color by tumor type', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&plots_coloring_selection=%7B"selectedOption"%3A"undefined_%7B%5C"clinicalAttributeId%5C"%3A%5C"TUMOR_TYPE%5C"%2C%5C"patientAttribute%5C"%3Afalse%2C%5C"studyId%5C"%3A%5C"ccle_broad_2019%5C"%7D"%7D&plots_horz_selection=%7B"dataType"%3A"MRNA_EXPRESSION"%2C"selectedGeneOption"%3A672%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A672%2C"dataType"%3A"MUTATION_EXTENDED"%2C"selectedGenericAssayOption"%3A"Afatinib-1"%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&session_id=5ed80b90e4b030a3bfd0c662&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab box plot color by tumor type highlight categories', () => {
        $(`svg#plots-tab-plot-svg .legendLabel_breast`).click();
        $(`svg#plots-tab-plot-svg .legendLabel_glioma`).click();
        waitForAndCheckPlotsTab();
    });

    it('plots tab waterfall plot color by tumor type', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&plots_coloring_selection=%7B"selectedOption"%3A"undefined_%7B%5C"clinicalAttributeId%5C"%3A%5C"TUMOR_TYPE%5C"%2C%5C"patientAttribute%5C"%3Afalse%2C%5C"studyId%5C"%3A%5C"ccle_broad_2019%5C"%7D"%7D&plots_horz_selection=%7B"dataType"%3A"none"%2C"selectedGeneOption"%3A672%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A672%2C"dataType"%3A"TREATMENT_RESPONSE"%2C"selectedGenericAssayOption"%3A"Afatinib-1"%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&session_id=5ed80b90e4b030a3bfd0c662&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab waterfall plot color by tumor type highlight categories', () => {
        $(`svg#plots-tab-plot-svg .legendLabel_breast`).click();
        $(`svg#plots-tab-plot-svg .legendLabel_glioma`).click();
        waitForAndCheckPlotsTab();
    });

    it('plots tab scatter plot color by mutation count', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&plots_coloring_selection=%7B"selectedOption"%3A"undefined_%7B%5C"clinicalAttributeId%5C"%3A%5C"MUTATION_COUNT%5C"%2C%5C"patientAttribute%5C"%3Afalse%2C%5C"studyId%5C"%3A%5C"ccle_broad_2019%5C"%7D"%7D&plots_horz_selection=%7B"dataType"%3A"MRNA_EXPRESSION"%2C"selectedGeneOption"%3A672%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A672%2C"dataType"%3A"TREATMENT_RESPONSE"%2C"selectedGenericAssayOption"%3A"Afatinib-1"%2C"selectedDataSourceOption"%3A"CCLE_drug_treatment_AUC"%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&session_id=5ed80b90e4b030a3bfd0c662&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab scatter plot color by mutation count log scale', () => {
        $('.coloringLogScale').click();
        waitForAndCheckPlotsTab();
    });

    it('plots tab box plot color by mutation count', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&plots_coloring_selection=%7B"selectedOption"%3A"undefined_%7B%5C"clinicalAttributeId%5C"%3A%5C"MUTATION_COUNT%5C"%2C%5C"patientAttribute%5C"%3Afalse%2C%5C"studyId%5C"%3A%5C"ccle_broad_2019%5C"%7D"%2C"logScale"%3A"false"%7D&plots_horz_selection=%7B"dataType"%3A"MRNA_EXPRESSION"%2C"selectedGeneOption"%3A672%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A672%2C"dataType"%3A"MUTATION_EXTENDED"%2C"selectedGenericAssayOption"%3A"Afatinib-1"%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&session_id=5ed80b90e4b030a3bfd0c662&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab box plot color by mutation count log scale', () => {
        $('.coloringLogScale').click();
        waitForAndCheckPlotsTab();
    });

    it('plots tab waterfall plot color by mutation count', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&plots_coloring_selection=%7B"selectedOption"%3A"undefined_%7B%5C"clinicalAttributeId%5C"%3A%5C"MUTATION_COUNT%5C"%2C%5C"patientAttribute%5C"%3Afalse%2C%5C"studyId%5C"%3A%5C"ccle_broad_2019%5C"%7D"%2C"logScale"%3A"false"%7D&plots_horz_selection=%7B"dataType"%3A"none"%2C"selectedGeneOption"%3A672%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A672%2C"dataType"%3A"TREATMENT_RESPONSE"%2C"selectedGenericAssayOption"%3A"Afatinib-1"%2C"mutationCountBy"%3A"MutationType"%2C"logScale"%3A"false"%7D&session_id=5ed80b90e4b030a3bfd0c662&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
    it('plots tab waterfall plot color by mutation count log scale', () => {
        $('.coloringLogScale').click();
        waitForAndCheckPlotsTab();
    });
    it('plots tab with structural variant coloring', () => {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=prad_mich&case_set_id=prad_mich_cna_seq&data_priority=0&gene_list=ERG&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=prad_mich_cna&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=prad_mich_mutations&genetic_profile_ids_PROFILE_STRUCTURAL_VARIANT=prad_mich_fusion&plots_coloring_selection=%7B"colorByCopyNumber"%3A"true"%2C"colorBySv"%3A"true"%7D&plots_horz_selection=%7B"dataType"%3A"clinical_attribute"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A2078%2C"dataType"%3A"COPY_NUMBER_ALTERATION"%7D&profileFilter=0&tab_index=tab_visualize`
        );
        waitForAndCheckPlotsTab();
    });
});

describe('plots tab multiple studies screenshot tests', function() {
    before(function() {
        goToUrlAndSetLocalStorage(
            `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=lgg_ucsf_2014%2Cbrca_tcga&case_set_id=all&data_priority=0&gene_list=TP53&geneset_list=%20&plots_coloring_selection=%7B%7D&plots_horz_selection=%7B"selectedGeneOption"%3A7157%2C"dataType"%3A"clinical_attribute"%2C"selectedDataSourceOption"%3A"CANCER_TYPE_DETAILED"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A7157%2C"dataType"%3A"clinical_attribute"%2C"selectedDataSourceOption"%3A"CANCER_TYPE"%7D&profileFilter=0&tab_index=tab_visualize`
        );
        $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed({
            timeout: 20000,
        });
    });
    it('plots tab multiple studies with data availability alert', function() {
        waitForAndCheckPlotsTab();
    });
});

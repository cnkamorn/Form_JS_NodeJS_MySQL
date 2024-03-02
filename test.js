/* OPT-150673 START */
Insider.__external.CustomTrackInstories150673 = (config) => {
    'use strict';

    const { builderId, iconGoalId, pageGoalId } = config;

    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const wrapper = `.ins-preview-wrapper-${ variationId }`;

    const selectors = {
        instoryIcon: `${ wrapper } .instory-v2-group__item button`,
        instoryIconText: `${ wrapper } .ins-text`,
        instoryPageButton: `.item ${ wrapper } .ins-selected-option .ins-full-story-button`,
        instoryPageTitle: `${ wrapper } + header .instory-v2-top-menu__container span`
    };

    const instoryStorageName = `ins-clicked-instory-info-${ variationId }`;

    if (variationId) {
        const { instoryIcon, instoryIconText, instoryPageButton, instoryPageTitle } = selectors;

        Insider.eventManager.once(`click.icon:click:${ variationId }`, instoryIcon, (event) => {
            const instoryStorage = Insider.storage.localStorage.get(instoryStorageName) ?? {};

            instoryStorage.clickedIcon = Insider.dom(event.currentTarget).closest('li').find(instoryIconText)
                .nodes[0]?.outerText.replaceAll('\n', '') ?? '';

            Insider.storage.localStorage.set({
                name: instoryStorageName,
                value: instoryStorage,
                expires: Insider.dateHelper.addDay(1)
            });
        });

        Insider.eventManager.once(`click.page:click:${ variationId }`, instoryPageButton, (event) => {
            const instoryStorage = Insider.storage.localStorage.get(instoryStorageName) ?? {};

            instoryStorage.clickedPage = Insider.dom(event.currentTarget).closest('.item').find(instoryPageTitle).text()
                .trim() ?? '';

            Insider.storage.localStorage.set({
                name: instoryStorageName,
                value: instoryStorage,
                expires: Insider.dateHelper.addDay(1)
            });
        });

        if (Insider.systemRules.call('isOnAfterPaymentPage')) {
            const purchaseInterval = setInterval(() => {
                const lastPurchased = Insider.storageAccessor.customAttributes().last_purchased_destination_cty ?? '';

                if (Insider.fns.has(lastPurchased, Insider.storage.localStorage.get(instoryStorageName).clickedIcon)) {
                    Insider.utils.opt.sendCustomGoal(builderId, iconGoalId, true);
                    clearInterval(purchaseInterval);
                }

                if (Insider.fns.has(lastPurchased, Insider.storage.localStorage.get(instoryStorageName).clickedPage)) {
                    Insider.utils.opt.sendCustomGoal(builderId, pageGoalId, true);
                    clearInterval(purchaseInterval);
                }
            }, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND);

            setTimeout(() => {
                clearInterval(purchaseInterval);
            }, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND * 5);
        }
    }
};

true;
/* OPT-150673 END */
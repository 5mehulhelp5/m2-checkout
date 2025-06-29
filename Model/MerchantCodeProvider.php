<?php

namespace Tabby\Checkout\Model;

use Tabby\Checkout\Api\MerchantCodeProviderInterface;
use Magento\Store\Model\StoreManagerInterface;
use Tabby\Checkout\Gateway\Config\Config;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Catalog\Api\Data\ProductInterface;

class MerchantCodeProvider implements MerchantCodeProviderInterface
{
    /**
     * @var Config
     */
    private $moduleConfig;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * Constructor
     *
     * @param StoreManagerInterface $storeManager
     * @param Config $moduleConfig
     */
    public function __construct(
        StoreManagerInterface $storeManager,
        Config $moduleConfig
    ) {
        $this->storeManager = $storeManager;
        $this->moduleConfig = $moduleConfig;
    }

   /**
    * @inheritdoc
    */
    public function getMerchantCodeForProduct(ProductInterface $product) : string
    {
        return $this->getMerchantCode();
    }

   /**
    * @inheritdoc
    */
    public function getMerchantCodeForCart(CartInterface $quote) : string
    {
        return $this->getMerchantCode();
    }

   /**
    * @inheritdoc
    */
    public function getMerchantCodeForOrder(OrderInterface $order) : string
    {
        return $this->getMerchantCode();
    }

    /**
     * Get merchant code by Currency code
     *
     * @param string $currencyCode
     * @return string
     */
    public function getMerchantCodeByCurrency($currencyCode)
    {
        return substr($currencyCode, 0, 2);
    }
    /**
     * Get Base merchant code
     *
     * @param string $currencyCode
     * @return string
     */
    protected function getBaseMerchantCode()
    {
        return $this->moduleConfig->getUseAggregateCode()
            ? $this->getMerchantCodeByCurrency($this->storeManager->getStore()->getBaseCurrencyCode())
            : $this->storeManager->getStore()->getGroup()->getCode();
    }
    /**
     * Get merchant code
     *
     * @return string
     * @throws NoSuchEntityException
     */
    protected function getMerchantCode()
    {
        $merchantCode = $this->getBaseMerchantCode() . (
            $this->moduleConfig->getUseLocalCurrency()
                ? '_' . $this->getCurrencyCode()
                : ''
        );
        return $merchantCode;
    }

    /**
     * Getter for currency code
     *
     * @return string
     * @throws NoSuchEntityException
     */
    public function getCurrencyCode()
    {
        return $this->moduleConfig->getUseLocalCurrency()
            ? $this->storeManager->getStore()->getCurrentCurrency()->getCode()
            : $this->storeManager->getStore()->getBaseCurrency()->getCode();
    }
}

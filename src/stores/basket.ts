import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import {useToast} from "vue-toastification";
import {useApi} from "@/helpers/axios";

const toast = useToast()

export const useBasketStore = defineStore('basket', () => {
    const basket = reactive({
        products: [],
        productId: [],
    });
    const check = ref()
    const addToBasket = (item: { id: any; }) => {
        onlyByID(item)
        const existingItem = basket.products.find((basketItem) => basketItem.product.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            basket.products.push({
                product: item,
                quantity: 1,
            });
        }
    };

    const onlyByID = (item: { id: any; }) => {
        // @ts-ignore
        const existingItem = basket.productId.find((basketItem) => basketItem.product.id === item.id);
        if (existingItem) {
            // @ts-ignore
            existingItem.quantity += 1;
        } else {
            // @ts-ignore
            basket.productId.push({
                product: item?.id,
                quantity: 1,
            });
        }
    }

    const removeItem = (id: number) => {
        // @ts-ignore
        const indexOfItem = basket.products.findIndex((basketItem) => basketItem.product.id === id);
        if (indexOfItem !== -1) {
            // @ts-ignore
            basket.products = basket.products.filter((basketItem) => basketItem.product.id !== id);
        } else {
            console.warn(`Item with id ${id} not found in the basket.`);
        }
    };

    const createOrder = async (courierId, consumerId, products, full_paid, price_paid, bulk_sell) => {
        try {
            return await useApi.post('/orders/', {
                courier: courierId,
                consumer: consumerId,
                products: products,
                full_paid: full_paid || false,
                price_paid: price_paid || 0,
                bulk_sell: bulk_sell || false
            });
        } catch (error) {
            if (error.response.status === 400) {
                for (const [key, value] of Object.entries(error.response.data)) {
                    toast.error(value);
                }
            } else {
                toast.error("Buyurtma yaratishda xatolik yuz berdi!1");
            }

            throw error; // Rethrow the error to indicate failure
        }
    };

    return {
        basket,
        check,
        addToBasket,
        removeItem,
        createOrder
    };
});

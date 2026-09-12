import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByIdAction } from "../actions/get-product-by-id.action"
import { createUpdateProductAction } from "../actions/get-update-product.action"



export const useProduct = (id: string) => {

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['product', { id }],
        queryFn: () => getProductByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5,
        enabled: !!id
    })

    const mutation = useMutation({
        mutationFn: createUpdateProductAction,
        onSuccess: (product) => {
            // Invalidar caché
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', { id: product.id }] });

            //Actualizar query data
            queryClient.setQueryData(['products', { id: product.id }], product);
        }
    });

    // const handleSubmitForm = async (productLike: Partial<Product>) => {

    // }

    return {
        ...query,
        mutation
    }
}

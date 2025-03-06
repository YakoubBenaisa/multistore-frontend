import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface PricingPlan {
  name: string;
  price: number;
  features: string[];
}

const basePlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 29,
    features: ['Basic Analytics', 'Up to 5 Team Members', '5GB Storage'],
  },
  {
    name: 'Professional',
    price: 99,
    features: [
      'Advanced Analytics',
      'Up to 20 Team Members',
      '50GB Storage',
      'Priority Support',
    ],
  },
  {
    name: 'Enterprise',
    price: 299,
    features: [
      'Custom Analytics',
      'Unlimited Team Members',
      'Unlimited Storage',
      '24/7 Support',
      'Custom Integrations',
    ],
  },
];

const customFeatures = [
  'API Access',
  'Custom Domain',
  'White Labeling',
  'Automated Reports',
  'Advanced Security',
];

export const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(basePlans);
  const [availableFeatures, setAvailableFeatures] = useState<string[]>(customFeatures);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      return;
    }

    if (source.droppableId === 'available-features') {
      const feature = availableFeatures[source.index];
      const updatedPlans = [...plans];
      const planIndex = parseInt(destination.droppableId.split('-')[1]);
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        features: [...updatedPlans[planIndex].features, feature],
      };
      
      const updatedFeatures = availableFeatures.filter((_, index) => index !== source.index);
      
      setPlans(updatedPlans);
      setAvailableFeatures(updatedFeatures);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="py-20 bg-white dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Flexible Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the perfect plan for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, planIndex) => (
              <Droppable key={planIndex} droppableId={`plan-${planIndex}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8 min-h-[200px]">
                      {plan.features.map((feature, index) => (
                        <Draggable
                          key={`${feature}-${index}`}
                          draggableId={`${feature}-${planIndex}-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center text-gray-600 dark:text-gray-300"
                            >
                              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                    <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                      Get Started
                    </button>
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          <div className=" bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">

            <div className=''>
              
              <h4 className=" text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Features (Drag to any plan)
              </h4>
              <Droppable droppableId="available-features">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-wrap gap-4"
                  >
                    {availableFeatures.map((feature, index) => (
                      <Draggable
                        key={feature}
                        draggableId={`available-${feature}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white dark:bg-gray-800 dark:text-white px-4 py-2 rounded-lg shadow cursor-move"
                          >
                            {feature}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </section>
    </DragDropContext>
  );
};
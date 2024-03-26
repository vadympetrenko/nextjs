export default async function Page() {
  const response = await fetch(
    "https://order.edojapan.com/api/location/menu?menuId=18565&rid=9089"
  );
  const data = await response.json();

  return (
    <>
      <ul className="rounded-l shadow-lg bg-gray-100 overflow-auto whitespace-nowrap left-1/2 translate-x-[-50%] mb-4 fixed top-1 max-w-[768px] m-auto">
        {data.MenuItemGroups.map((item: any) => {
          return (
            <li
              key={item.Id}
              className="inline-block mx-1 my-2 bg-gray-200 rounded-xl"
            >
              <a
                className="p-3 inline-block"
                href={`#${item.Name.replaceAll(" ", "")}`}
              >
                {item.Name}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="max-w-[768px] m-auto">
        {data.MenuItemGroups.map((item: any) => {
          return (
            <ul key={item.Id} className="first:mt-24">
              <li
                className="text-center font-bold text-2xl mb-2"
                id={item.Name.replaceAll(" ", "")}
              >
                {item.Name}
              </li>
              <ol>
                {item.Items.map((item: any) => {
                  return (
                    <li key={item.Id} className="bg-white rounded-xl p-4 mb-2">
                      <p className="font-bold"> {item.Name}</p>
                      {item.DigitalAssetsJson && (
                        <img
                          className="max-w-[300px] block m-auto"
                          src={JSON.parse(item.DigitalAssetsJson)[0].ImageLink}
                        />
                      )}
                      {Boolean(JSON.parse(item.PricesJson)[0].Amount) && (
                        <p className="text-center text-gray-800">
                          Price: {JSON.parse(item.PricesJson)[0].Amount} $
                        </p>
                      )}
                      {item.Description && (
                        <p>Description: {item.Description}</p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </ul>
          );
        })}
      </div>
    </>
  );
}
